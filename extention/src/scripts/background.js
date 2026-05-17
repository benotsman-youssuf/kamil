const CLIENT_ID = '1d77aca2-f760-4c4e-bb0e-bde4c3101992';
const CLIENT_SECRET = 'qeQ~nR.rD2zbjXIdy-wA2duvae';
const AUTH_BASE_URL = 'https://oauth2.quran.foundation';
const USER_API = 'https://apis.quran.foundation/auth/v1';

// ═══════════════════════════════════════════════════════════════
// INSTALLATION & TAB REFRESH CONTROLLER
// ═══════════════════════════════════════════════════════════════

chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.query({ active: true }, (tabs) => {
    tabs.forEach((tab) => {
      chrome.tabs.sendMessage(tab.id, { type: 'PRELOAD' }).catch(() => {});
    });
  });
  // Auto-sync offline bookmarks if already logged in on startup
  syncOfflineBookmarks();
});

// ═══════════════════════════════════════════════════════════════
// STORAGE MUTATION TRIGGERS
// ═══════════════════════════════════════════════════════════════

chrome.storage.onChanged.addListener((changes, area) => {
  // 1. Sync Toggle Change -> Dispatch to all tabs
  if (area === 'sync' && changes.kamilEnabled) {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, {
          type: 'ENABLED_CHANGED',
          enabled: changes.kamilEnabled.newValue !== false,
        }).catch(() => {});
      });
    });
  }

  // 2. Token Change -> Trigger User Profile fetch & Sync offline queues
  if (area === 'local' && changes.qf_tokens) {
    chrome.storage.local.get('qf_tokens', (res) => {
      if (res.qf_tokens) {
        ensureUserProfile();
        syncOfflineBookmarks();
      } else {
        chrome.storage.local.remove('user_profile');
      }
    });
  }
});

// ═══════════════════════════════════════════════════════════════
// OAUTH & TOKEN MANAGER
// ═══════════════════════════════════════════════════════════════

async function getValidAccessToken() {
  return new Promise((resolve) => {
    chrome.storage.local.get('qf_tokens', async (res) => {
      if (!res.qf_tokens) return resolve(null);
      let tokens = null;
      try {
        tokens = typeof res.qf_tokens === 'string' ? JSON.parse(res.qf_tokens) : res.qf_tokens;
      } catch (e) {
        return resolve(null);
      }
      if (!tokens || !tokens.access_token) return resolve(null);

      // Check if expired or within 60 seconds of expiry
      if (tokens.expires_at && Date.now() >= tokens.expires_at - 60000) {
        const refreshed = await refreshTokens(tokens.refresh_token);
        resolve(refreshed ? refreshed.access_token : null);
      } else {
        resolve(tokens.access_token);
      }
    });
  });
}

async function refreshTokens(refreshToken) {
  if (!refreshToken) return null;
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken
  });

  if (CLIENT_SECRET) {
    const basicAuth = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
    headers['Authorization'] = `Basic ${basicAuth}`;
  } else {
    body.set('client_id', CLIENT_ID);
  }

  try {
    const response = await fetch(`${AUTH_BASE_URL}/oauth2/token`, {
      method: 'POST',
      headers,
      body
    });

    if (!response.ok) {
      chrome.storage.local.remove(['qf_tokens', 'user_profile']);
      return null;
    }

    const data = await response.json();
    data.expires_at = Date.now() + (data.expires_in * 1000);
    chrome.storage.local.set({ qf_tokens: data });
    return data;
  } catch (err) {
    console.error('[Kamil BG] Error refreshing token:', err);
    return null;
  }
}

async function ensureUserProfile() {
  const token = await getValidAccessToken();
  if (!token) return;

  try {
    const response = await fetch(`${USER_API}/users/profile`, {
      headers: {
        'x-auth-token': token,
        'x-client-id': CLIENT_ID
      }
    });
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data) {
        chrome.storage.local.set({ user_profile: data.data });
      }
    }
  } catch (e) {
    console.error('[Kamil BG] Error fetching profile:', e);
  }
}

// ═══════════════════════════════════════════════════════════════
// COLLECTION MANAGEMENT & BOOKMARKING REST WRAPPERS
// ═══════════════════════════════════════════════════════════════

async function apiFetchCollections(token) {
  const response = await fetch(`${USER_API}/collections?first=20`, {
    headers: {
      'x-auth-token': token,
      'x-client-id': CLIENT_ID
    }
  });
  if (!response.ok) throw new Error('Failed to fetch collections');
  const res = await response.json();
  return res.data || [];
}

async function apiCreateCollection(token, name) {
  const response = await fetch(`${USER_API}/collections`, {
    method: 'POST',
    headers: {
      'x-auth-token': token,
      'x-client-id': CLIENT_ID,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name })
  });
  if (!response.ok) throw new Error('Failed to create collection');
  const res = await response.json();
  return res.data;
}

async function apiAddBookmark(token, collectionId, verseKey) {
  const [chapterId, verseNumber] = verseKey.split(':').map(Number);
  const response = await fetch(`${USER_API}/collections/${collectionId}/bookmarks`, {
    method: 'POST',
    headers: {
      'x-auth-token': token,
      'x-client-id': CLIENT_ID,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      key: chapterId,
      verseNumber,
      type: 'ayah',
      mushafId: 1
    })
  });
  if (!response.ok) throw new Error('Failed to add bookmark');
  return await response.json();
}

async function apiDeleteCollection(token, collectionId) {
  const response = await fetch(`${USER_API}/collections/${collectionId}`, {
    method: 'DELETE',
    headers: {
      'x-auth-token': token,
      'x-client-id': CLIENT_ID
    }
  });
  if (!response.ok) throw new Error('Failed to delete collection');
  return true;
}

async function apiFetchCollectionItems(token, collectionId) {
  const response = await fetch(`${USER_API}/collections/${collectionId}`, {
    headers: {
      'x-auth-token': token,
      'x-client-id': CLIENT_ID
    }
  });
  if (!response.ok) throw new Error('Failed to fetch collection items');
  const res = await response.json();
  return { collection: res.data?.collection || {}, bookmarks: res.data?.bookmarks || [] };
}

async function apiDeleteCollectionBookmark(token, collectionId, verseKey) {
  const [chapterId, verseNumber] = verseKey.split(':').map(Number);
  const response = await fetch(`${USER_API}/collections/${collectionId}/bookmarks`, {
    method: 'DELETE',
    headers: {
      'x-auth-token': token,
      'x-client-id': CLIENT_ID,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      key: chapterId,
      verseNumber,
      type: 'ayah',
      mushafId: 1
    })
  });
  if (!response.ok) throw new Error('Failed to delete bookmark');
  return true;
}

// ═══════════════════════════════════════════════════════════════
// OFFLINE QUEUE & SYNC ENGINE
// ═══════════════════════════════════════════════════════════════

async function syncOfflineBookmarks() {
  const token = await getValidAccessToken();
  if (!token) return;

  chrome.storage.local.get('offline_collections', async (res) => {
    const offlineCollections = res.offline_collections || [];
    if (offlineCollections.length === 0) return;

    console.log(`[Kamil BG] Syncing ${offlineCollections.length} offline collections...`);
    try {
      const collections = await apiFetchCollections(token);
      
      for (const col of offlineCollections) {
        let backendCol = collections.find(c => c.name.toLowerCase() === col.name.toLowerCase());
        let collectionId = '';
        
        if (!backendCol) {
          const newCol = await apiCreateCollection(token, col.name);
          collectionId = newCol.id;
        } else {
          collectionId = backendCol.id;
        }

        // Add bookmarks
        for (const b of col.bookmarks) {
          try {
            await apiAddBookmark(token, collectionId, b.verseKey);
          } catch (e) {
            console.warn(`[Kamil BG] Bookmark ${b.verseKey} already exists or failed:`, e.message);
          }
        }
      }

      // Clear offline collections
      chrome.storage.local.remove('offline_collections', () => {
        console.log('[Kamil BG] Offline collections successfully synced and cleared!');
      });
    } catch (err) {
      console.error('[Kamil BG] Error syncing offline collections:', err);
    }
  });
}

// ═══════════════════════════════════════════════════════════════
// SAVE VERSE DISPATCHER (MESSAGE LISTENER)
// ═══════════════════════════════════════════════════════════════

async function handleSaveVerse(verseKey, hostname, favicon) {
  // 1. Get token
  const token = await getValidAccessToken();
  
  // Save favicon to a local mapping
  chrome.storage.local.get('domain_favicons', (res) => {
    const favicons = res.domain_favicons || {};
    favicons[hostname] = favicon;
    chrome.storage.local.set({ domain_favicons: favicons });
  });

  // Track the verse insertion history
  chrome.storage.local.get('history', (res) => {
    const history = res.history || [];
    // Prevent duplicate entries adjacent to each other
    if (history.length === 0 || history[0].verseKey !== verseKey || history[0].hostname !== hostname) {
      history.unshift({
        verseKey,
        hostname,
        favicon,
        timestamp: Date.now()
      });
      chrome.storage.local.set({ history: history.slice(0, 50) });
    }
  });

  if (!token) {
    // Guest / Offline Mode: Save to offline collections in storage
    return new Promise((resolve) => {
      chrome.storage.local.get('offline_collections', (res) => {
        let collections = res.offline_collections || [];
        let col = collections.find(c => c.name.toLowerCase() === hostname.toLowerCase());
        if (!col) {
          col = {
            id: 'offline_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            name: hostname,
            favicon,
            bookmarks: []
          };
          collections.push(col);
        }
        
        // Add bookmark if not duplicate
        if (!col.bookmarks.some(b => b.verseKey === verseKey)) {
          col.bookmarks.push({
            verseKey,
            timestamp: Date.now()
          });
        }
        
        chrome.storage.local.set({ offline_collections: collections }, () => {
          resolve({ offline: true, collection: col });
        });
      });
    });
  }

  // Online Mode: Sync to Backend
  const collections = await apiFetchCollections(token);
  
  // Find matching collection
  let col = collections.find(c => c.name.toLowerCase() === hostname.toLowerCase());
  let collectionId = '';
  
  if (!col) {
    console.log(`[Kamil BG] Creating collection for ${hostname}...`);
    const newCol = await apiCreateCollection(token, hostname);
    collectionId = newCol.id;
  } else {
    collectionId = col.id;
  }
  
  // Add bookmark
  await apiAddBookmark(token, collectionId, verseKey);
  
  return { offline: false, collectionId };
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'SAVE_VERSE') {
    handleSaveVerse(msg.verseKey, msg.hostname, msg.favicon)
      .then(result => sendResponse({ success: true, ...result }))
      .catch(err => {
        console.error('[Kamil BG] Error saving verse:', err);
        sendResponse({ success: false, error: err.message });
      });
    return true;
  }

  if (msg.type === 'CREATE_COLLECTION') {
    getValidAccessToken().then(token => {
      if (!token) return sendResponse({ success: false, error: 'Not authenticated' });
      return apiCreateCollection(token, msg.name);
    }).then(result => sendResponse({ success: true, data: result }))
    .catch(err => sendResponse({ success: false, error: err.message }));
    return true;
  }

  if (msg.type === 'DELETE_COLLECTION') {
    getValidAccessToken().then(token => {
      if (!token) return sendResponse({ success: false, error: 'Not authenticated' });
      return apiDeleteCollection(token, msg.collectionId);
    }).then(() => sendResponse({ success: true }))
    .catch(err => sendResponse({ success: false, error: err.message }));
    return true;
  }

  if (msg.type === 'FETCH_COLLECTION_ITEMS') {
    getValidAccessToken().then(token => {
      if (!token) return sendResponse({ success: false, error: 'Not authenticated' });
      return apiFetchCollectionItems(token, msg.collectionId);
    }).then(result => sendResponse({ success: true, data: result }))
    .catch(err => sendResponse({ success: false, error: err.message }));
    return true;
  }

  if (msg.type === 'DELETE_COLLECTION_BOOKMARK') {
    getValidAccessToken().then(token => {
      if (!token) return sendResponse({ success: false, error: 'Not authenticated' });
      return apiDeleteCollectionBookmark(token, msg.collectionId, msg.verseKey);
    }).then(() => sendResponse({ success: true }))
    .catch(err => sendResponse({ success: false, error: err.message }));
    return true;
  }

  if (msg.type === 'LOGOUT') {
    chrome.storage.local.remove(['qf_tokens', 'user_profile'], () => {
      sendResponse({ success: true });
    });
    return true;
  }
});
