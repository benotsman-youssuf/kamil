'use strict';

// ═══════════════════════════════════════════════════════════════
// CONSTANTS & ARABIC DICTIONARY
// ═══════════════════════════════════════════════════════════════

const CLIENT_ID = '1d77aca2-f760-4c4e-bb0e-bde4c3101992';
const AUTH_BASE_URL = 'https://oauth2.quran.foundation';
const USER_API = 'https://apis.quran.foundation/auth/v1';
const API_BASE_URL = 'https://apis.quran.foundation';

const APP_FRONTEND_URL = 'https://kamilapp.vercel.app';

const SURAH_NAMES = {
  1: "الفاتحة", 2: "البقرة", 3: "آل عمران", 4: "النساء", 5: "المائدة", 6: "الأنعام", 7: "الأعراف", 8: "الأنفال",
  9: "التوبة", 10: "يونس", 11: "هود", 12: "يوسف", 13: "الرعد", 14: "إبراهيم", 15: "الحجر", 16: "النحل",
  17: "الإسراء", 18: "الكهف", 19: "مريم", 20: "طه", 21: "الأنبياء", 22: "الحج", 23: "المؤمنون", 24: "النور",
  25: "الفرقان", 26: "الشعراء", 27: "النمل", 28: "القصص", 29: "العنكبوت", 30: "الروم", 31: "لقمان", 32: "السجدة",
  33: "الأحزاب", 34: "سبأ", 35: "فاطر", 36: "يس", 37: "الصافات", 38: "ص", 39: "الزمر", 40: "غافر",
  41: "فصلت", 42: "الشورى", 43: "الزخرف", 44: "الدخان", 45: "الجاثية", 46: "الأحقاف", 47: "محمد", 48: "الفتح",
  49: "الحجرات", 50: "ق", 51: "الذاريات", 52: "الطور", 53: "النجم", 54: "القمر", 55: "الرحمن", 56: "الواقعة",
  57: "الحديد", 58: "المجادلة", 59: "الحشر", 60: "الممتحنة", 61: "الصف", 62: "الجمعة", 63: "المنافقون", 64: "التغابن",
  65: "الطلاق", 66: "التحريم", 67: "الملك", 68: "القلم", 69: "الحاقة", 70: "المعارج", 71: "نوح", 72: "الجن",
  73: "المزمل", 74: "المدثر", 75: "القيامة", 76: "الإنسان", 77: "المرسلات", 78: "النبأ", 79: "النازعات", 80: "عبس",
  81: "التكوير", 82: "الانفطار", 83: "المطففين", 84: "الانشقاق", 85: "البروج", 86: "الطارق", 87: "الأعلى", 88: "الغاشية",
  89: "الفجر", 90: "البلد", 91: "الشمس", 92: "الليل", 93: "الضحى", 94: "الشرح", 95: "التين", 96: "العلق",
  97: "القدر", 98: "البينة", 99: "الزلزلة", 100: "العاديات", 101: "القارعة", 102: "التكاثر", 103: "العصر", 104: "الهمزة",
  105: "الفيل", 106: "قريش", 107: "الماعون", 108: "الكوثر", 109: "الكافرون", 110: "النصر", 111: "المسد", 112: "الإخلاص",
  113: "الفلق", 114: "الناس"
};

// Global cache to prevent redundant network calls for Quranic text
const verseTextCache = {};

let currentDomain = '';
let currentFavicon = '';

function faviconUrlForDomain(domain) {
  if (!domain || domain === 'الموقع') return 'globe.svg';
  try {
    return chrome.runtime.getURL('_favicon/?pageUrl=' + encodeURIComponent('https://' + domain) + '&size=32');
  } catch {
    return 'globe.svg';
  }
}

// ═══════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', async () => {
  setupTabs();
  setupToggle();
  setupCollectionManagement();
  setupLoginLogout();
  await determineActiveTab();
  updateUI();

  // Listen for storage changes to synchronize across popups instantly
  chrome.storage.onChanged.addListener(() => {
    updateUI();
  });
});

// ═══════════════════════════════════════════════════════════════
// DYNAMIC DOM PARSERS & TAB HANDLERS
// ═══════════════════════════════════════════════════════════════

function setupTabs() {
  const tabs = document.querySelectorAll('.tab-link');
  const panes = document.querySelectorAll('.tab-pane');
  const underline = document.querySelector('.tab-underline');

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      // Toggle active link
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Toggle active pane
      const target = tab.getAttribute('data-tab');
      panes.forEach(p => {
        if (p.id === target) {
          p.classList.add('active');
        } else {
          p.classList.remove('active');
        }
      });

      // Move premium gold underline
      if (underline) {
        underline.style.transform = `translateX(-${index * 100}%)`;
      }
    });
  });
}

function setupToggle() {
  const toggleBtn = document.getElementById('toggle-btn');
  const statusBar = document.getElementById('status-bar');
  const statusText = document.getElementById('status-text');

  // Load current toggle preference
  chrome.storage.sync.get({ kamilEnabled: true }, (prefs) => {
    const enabled = prefs.kamilEnabled !== false;
    updateToggleState(enabled);
  });

  toggleBtn.addEventListener('click', () => {
    chrome.storage.sync.get({ kamilEnabled: true }, (prefs) => {
      const current = prefs.kamilEnabled !== false;
      const next = !current;
      chrome.storage.sync.set({ kamilEnabled: next }, () => {
        updateToggleState(next);
      });
    });
  });

  function updateToggleState(enabled) {
    if (enabled) {
      toggleBtn.classList.add('active');
      statusBar.classList.add('active');
      statusText.textContent = 'الإضافة مفعلة في جميع المواقع';
    } else {
      toggleBtn.classList.remove('active');
      statusBar.classList.remove('active');
      statusText.textContent = 'الإضافة متوقفة حالياً';
    }
  }
}

async function determineActiveTab() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0] && tabs[0].url) {
        try {
          const urlObj = new URL(tabs[0].url);
          currentDomain = urlObj.hostname;
          // Capture favicon URL
          currentFavicon = tabs[0].favIconUrl || '';
          if (!currentFavicon) {
            currentFavicon = `${urlObj.origin}/favicon.ico`;
          }
        } catch {
          currentDomain = 'الموقع';
          currentFavicon = 'globe.svg';
        }
      } else {
        currentDomain = 'الموقع';
        currentFavicon = 'globe.svg';
      }
      resolve();
    });
  });
}

// ═══════════════════════════════════════════════════════════════
// UI SYNC & RENDER ENGINE
// ═══════════════════════════════════════════════════════════════

function updateUI() {
  chrome.storage.local.get(['qf_tokens', 'user_profile', 'history', 'offline_collections', 'domain_favicons'], async (res) => {
    // 1. Auth Sync
    const hasTokens = !!res.qf_tokens;
    const profile = res.user_profile;
    renderAuthSection(hasTokens, profile);

    // 2. Active Tab Metadata
    document.getElementById('site-domain').textContent = currentDomain;
    const siteFaviconEl = document.getElementById('site-favicon');
    if (siteFaviconEl && currentFavicon) {
      siteFaviconEl.src = currentFavicon;
    }

    // 3. Save current favicon mapping if available
    if (currentDomain && currentDomain !== 'الموقع' && currentFavicon && !currentFavicon.startsWith('chrome:')) {
      const favicons = res.domain_favicons || {};
      if (favicons[currentDomain] !== currentFavicon) {
        favicons[currentDomain] = currentFavicon;
        chrome.storage.local.set({ domain_favicons: favicons });
      }
    }

    // 4. Render active site stats & verses
    const siteVersesList = document.getElementById('site-verses-list');
    const siteStatsEl = document.getElementById('site-stats');
    
    // Filter history for current site
    const history = res.history || [];
    const siteHistory = history.filter(item => item.hostname.toLowerCase() === currentDomain.toLowerCase());

    if (siteHistory.length > 0) {
      siteStatsEl.textContent = `حُفِظَت ${siteHistory.length} آية في هذا الموقع`;
      siteVersesList.innerHTML = '';
      
      for (const item of siteHistory) {
        const verseEl = await buildVerseItemDOM(item);
        siteVersesList.appendChild(verseEl);
      }
    } else {
      siteStatsEl.textContent = 'لم يتم حفظ آيات بعد';
      siteVersesList.innerHTML = `
        <div class="empty-state">
          <svg class="empty-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          <p>اكتب <span>/</span> في أي حقل نصي للبحث وإدراج الآيات القرآنية تلقائياً في هذا الموقع.</p>
        </div>
      `;
    }

    // 5. Render All Collections
    renderCollectionsTab(res);
  });
}

// ═══════════════════════════════════════════════════════════════
// BACKGROUND MESSAGE HELPERS
// ═══════════════════════════════════════════════════════════════

function bgSend(msg) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(msg, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else if (!response || !response.success) {
        reject(new Error(response?.error || 'Unknown error'));
      } else {
        resolve(response);
      }
    });
  });
}

async function createCollection(name) {
  return bgSend({ type: 'CREATE_COLLECTION', name });
}

async function deleteCollection(collectionId) {
  return bgSend({ type: 'DELETE_COLLECTION', collectionId });
}

async function fetchCollectionItems(collectionId) {
  return bgSend({ type: 'FETCH_COLLECTION_ITEMS', collectionId });
}

async function deleteCollectionBookmark(collectionId, verseKey) {
  return bgSend({ type: 'DELETE_COLLECTION_BOOKMARK', collectionId, verseKey });
}

async function logout() {
  return bgSend({ type: 'LOGOUT' });
}

function loginViaWebApp() {
  chrome.tabs.create({ url: APP_FRONTEND_URL });
}

// ═══════════════════════════════════════════════════════════════
// COLLECTION DETAIL VIEW STATE
// ═══════════════════════════════════════════════════════════════

let currentDetailCollectionId = null;

function showCollectionDetail(collectionId, collectionName) {
  currentDetailCollectionId = collectionId;
  document.getElementById('collections-list').style.display = 'none';
  document.getElementById('collection-detail').style.display = 'flex';
  document.getElementById('btn-back-collections').style.display = 'inline-flex';
  document.getElementById('btn-new-collection').style.display = 'none';
  document.getElementById('collections-title').textContent = collectionName;
  document.getElementById('btn-refresh-collections').style.display = 'none';
  loadDetailItems(collectionId);
}

function hideCollectionDetail() {
  currentDetailCollectionId = null;
  document.getElementById('collections-list').style.display = 'flex';
  document.getElementById('collection-detail').style.display = 'none';
  document.getElementById('btn-back-collections').style.display = 'none';
  document.getElementById('btn-new-collection').style.display = '';
  document.getElementById('collections-title').textContent = 'كل المجموعات';
  document.getElementById('btn-refresh-collections').style.display = '';
}

async function loadDetailItems(collectionId) {
  const container = document.getElementById('detail-items');
  container.innerHTML = '<div class="detail-empty"><span class="spinner"></span></div>';

  try {
    const res = await fetchCollectionItems(collectionId);
    const bookmarks = res.data?.bookmarks || [];
    const count = res.data?.collection?.bookmarksCount || bookmarks.length;

    if (bookmarks.length === 0) {
      container.innerHTML = `<div class="detail-empty">لا توجد آيات في هذه المجموعة</div>`;
      return;
    }

    container.innerHTML = `<div class="detail-header-info">${count} آية</div>`;

    for (const bm of bookmarks) {
      const surahNum = Number(bm.key) || 1;
      const surahName = SURAH_NAMES[surahNum] || `سورة ${surahNum}`;
      const verseKey = `${bm.key}:${bm.verseNumber}`;

      const item = document.createElement('div');
      item.className = 'detail-item';

      const label = document.createElement('span');
      label.className = 'detail-item-key';
      label.textContent = `${surahName} (${bm.verseNumber})`;

      const removeBtn = document.createElement('button');
      removeBtn.className = 'detail-item-remove';
      removeBtn.innerHTML = '✕';
      removeBtn.title = 'إزالة من المجموعة';
      removeBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (!confirm('إزالة هذه الآية من المجموعة؟')) return;
        try {
          removeBtn.disabled = true;
          removeBtn.style.opacity = '0.3';
          await deleteCollectionBookmark(collectionId, verseKey);
          item.remove();
          const remaining = container.querySelectorAll('.detail-item').length;
          if (remaining === 0) {
            container.innerHTML = '<div class="detail-empty">لا توجد آيات في هذه المجموعة</div>';
          }
        } catch (err) {
          console.error('Error removing bookmark:', err);
          removeBtn.disabled = false;
          removeBtn.style.opacity = '';
        }
      });

      item.appendChild(label);
      item.appendChild(removeBtn);
      container.appendChild(item);
    }
  } catch (err) {
    console.error('Error loading collection items:', err);
    container.innerHTML = '<div class="detail-empty">فشل تحميل الآيات</div>';
  }
}

function renderAuthSection(hasTokens, profile) {
  const unconnected = document.getElementById('auth-unconnected');
  const connected = document.getElementById('auth-connected');

  if (hasTokens) {
    unconnected.classList.remove('active');
    connected.classList.add('active');

    if (profile) {
      document.getElementById('user-name').textContent = `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'مستخدم كمل';
      document.getElementById('user-email').textContent = profile.email || '';
      
      const avatarEl = document.getElementById('user-avatar');
      if (profile.avatarUrls && profile.avatarUrls.small) {
        avatarEl.style.backgroundImage = `url(${profile.avatarUrls.small})`;
        avatarEl.style.backgroundSize = 'cover';
        avatarEl.textContent = '';
      } else {
        avatarEl.style.backgroundImage = 'none';
        avatarEl.textContent = (profile.firstName || 'ك').charAt(0);
      }
    }
  } else {
    connected.classList.remove('active');
    unconnected.classList.add('active');
  }
}

async function renderCollectionsTab(storageData) {
  const container = document.getElementById('collections-list');

  // Hide detail view if returning to list
  if (!currentDetailCollectionId) {
    container.style.display = 'flex';
    document.getElementById('collection-detail').style.display = 'none';
    document.getElementById('btn-back-collections').style.display = 'none';
    document.getElementById('btn-new-collection').style.display = '';
    document.getElementById('collections-title').textContent = 'كل المجموعات';
    document.getElementById('btn-refresh-collections').style.display = '';
  }

  const offlineCol = storageData.offline_collections || [];
  const favicons = storageData.domain_favicons || {};

  // Fetch online collections if authorized
  let onlineCol = [];
  if (storageData.qf_tokens) {
    try {
      let tokens = typeof storageData.qf_tokens === 'string' ? JSON.parse(storageData.qf_tokens) : storageData.qf_tokens;
      if (tokens && tokens.access_token) {
        const response = await fetch(`${USER_API}/collections?first=20`, {
          headers: {
            'x-auth-token': tokens.access_token,
            'x-client-id': CLIENT_ID
          }
        });
        if (response.ok) {
          const res = await response.json();
          if (Array.isArray(res.data)) onlineCol = res.data;
        }
      }
    } catch (e) {
      console.error('Error fetching online collections for UI:', e);
    }
  }

  // Combine collections
  const allDomainCollections = {};

  offlineCol.forEach(c => {
    allDomainCollections[c.name.toLowerCase()] = {
      name: c.name,
      favicon: favicons[c.name] || faviconUrlForDomain(c.name),
      count: c.bookmarks.length,
      isOffline: true
    };
  });

  onlineCol.forEach(c => {
    const key = c.name.toLowerCase();
    const count = c.bookmarksCount || c.count || 0;
    allDomainCollections[key] = {
      name: c.name,
      favicon: favicons[c.name] || faviconUrlForDomain(c.name),
      count: Math.max(count, allDomainCollections[key]?.count || 0),
      isOffline: false,
      id: c.id,
      isDefault: c.isDefault
    };
  });

  const list = Object.values(allDomainCollections);

  if (list.length > 0) {
    container.innerHTML = '';
    list.forEach(col => {
      const card = document.createElement('div');
      card.className = 'collection-item-card';

      const meta = document.createElement('div');
      meta.className = 'col-meta';

      const img = document.createElement('img');
      img.className = 'col-favicon';
      img.src = col.favicon;
      img.onerror = () => { img.src = 'globe.svg'; };

      const details = document.createElement('div');
      details.className = 'col-details';

      const name = document.createElement('span');
      name.className = 'col-name';
      name.textContent = col.name;

      const count = document.createElement('span');
      count.className = 'col-count';
      count.textContent = `${col.count} آية` + (col.isOffline ? ' (محلي)' : '');

      details.appendChild(name);
      details.appendChild(count);
      meta.appendChild(img);
      meta.appendChild(details);

      const actions = document.createElement('div');
      actions.style.cssText = 'display:flex;align-items:center;gap:2px;';

      // Delete button (only for non-default, online collections)
      if (col.id && !col.isDefault) {
        const delBtn = document.createElement('button');
        delBtn.className = 'delete-col-btn';
        delBtn.innerHTML = '🗑️';
        delBtn.title = 'حذف المجموعة';
        delBtn.addEventListener('click', async (e) => {
          e.stopPropagation();
          if (!confirm(`حذف المجموعة "${col.name}" نهائياً؟`)) return;
          try {
            delBtn.disabled = true;
            await deleteCollection(col.id);
            updateUI();
          } catch (err) {
            console.error('Error deleting collection:', err);
            delBtn.disabled = false;
          }
        });
        actions.appendChild(delBtn);
      }

      // Open in web app button
      const webBtn = document.createElement('button');
      webBtn.className = 'col-action-btn';
      webBtn.innerHTML = '↗';
      webBtn.title = 'فتح في التطبيق';
      webBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (col.id) {
          window.open(`${APP_FRONTEND_URL}/collections/${col.id}`, '_blank');
        } else {
          window.open(APP_FRONTEND_URL, '_blank');
        }
      });
      actions.appendChild(webBtn);

      card.appendChild(meta);
      card.appendChild(actions);

      // Click card to view items inline (only for online collections)
      if (col.id) {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
          showCollectionDetail(col.id, col.name);
        });
      }

      container.appendChild(card);
    });
  } else {
    container.innerHTML = `
      <div class="empty-state">
        <svg class="empty-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        </svg>
        <p>لا توجد مجموعات بعد. ابدأ بإدراج الآيات لإنشاء مجموعات تلقائية للمواقع.</p>
      </div>
    `;
  }
}

// ═══════════════════════════════════════════════════════════════
// COLLECTION MANAGEMENT EVENT BINDINGS
// ═══════════════════════════════════════════════════════════════

function setupCollectionManagement() {
  const btnNew = document.getElementById('btn-new-collection');
  const createRow = document.getElementById('create-collection-row');
  const inputNew = document.getElementById('input-new-collection');
  const btnConfirm = document.getElementById('btn-confirm-create');
  const btnCancel = document.getElementById('btn-cancel-create');
  const btnBack = document.getElementById('btn-back-collections');
  const btnRefresh = document.getElementById('btn-refresh-collections');

  btnNew.addEventListener('click', () => {
    createRow.style.display = 'flex';
    inputNew.value = '';
    inputNew.focus();
    btnNew.style.display = 'none';
  });

  btnCancel.addEventListener('click', () => {
    createRow.style.display = 'none';
    btnNew.style.display = '';
  });

  inputNew.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') btnConfirm.click();
    if (e.key === 'Escape') btnCancel.click();
  });

  btnConfirm.addEventListener('click', async () => {
    const name = inputNew.value.trim();
    if (!name) return;

    try {
      btnConfirm.disabled = true;
      btnConfirm.textContent = '...';
      await createCollection(name);
      createRow.style.display = 'none';
      btnNew.style.display = '';
      inputNew.value = '';
      updateUI();
    } catch (err) {
      console.error('Error creating collection:', err);
    } finally {
      btnConfirm.disabled = false;
      btnConfirm.textContent = 'إنشاء';
    }
  });

  btnBack.addEventListener('click', () => {
    hideCollectionDetail();
    updateUI();
  });

  btnRefresh.addEventListener('click', () => {
    updateUI();
  });
}

// ═══════════════════════════════════════════════════════════════
// LOGIN / LOGOUT
// ═══════════════════════════════════════════════════════════════

function setupLoginLogout() {
  document.getElementById('btn-login').addEventListener('click', () => {
    loginViaWebApp();
  });

  document.getElementById('btn-logout').addEventListener('click', async () => {
    if (!confirm('تسجيل الخروج من حساب كمل؟')) return;
    try {
      await logout();
      updateUI();
    } catch (err) {
      console.error('Error logging out:', err);
    }
  });
}

// ═══════════════════════════════════════════════════════════════
// VERSE CACHING & ARABIC RENDERER
// ═══════════════════════════════════════════════════════════════

let contentTokenCache = null;
let contentTokenExpiry = 0;

async function getContentToken() {
  if (contentTokenCache && Date.now() < contentTokenExpiry - 60000) return contentTokenCache;
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };
  const CLIENT_SECRET = 'qeQ~nR.rD2zbjXIdy-wA2duvae';
  if (CLIENT_SECRET) {
    const basicAuth = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
    headers['Authorization'] = `Basic ${basicAuth}`;
  }
  try {
    const response = await fetch(`${AUTH_BASE_URL}/oauth2/token`, {
      method: 'POST',
      headers,
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        scope: 'content'
      })
    });
    if (response.ok) {
      const data = await response.json();
      contentTokenCache = data.access_token;
      contentTokenExpiry = Date.now() + (data.expires_in * 1000);
      return contentTokenCache;
    }
  } catch (e) {
    console.error('Error fetching content token:', e);
  }
  return null;
}

async function getVerseUthmaniText(verseKey) {
  if (verseTextCache[verseKey]) return verseTextCache[verseKey];

  try {
    const parts = verseKey.split(':');
    let surahNum = Number(parts[0]);
    const ayaNum = parts[1];

    if (isNaN(surahNum)) {
      const arabicName = parts[0];
      const foundKey = Object.keys(SURAH_NAMES).find(key => SURAH_NAMES[key] === arabicName);
      surahNum = foundKey ? Number(foundKey) : 1;
    }

    const normalizedKey = `${surahNum}:${ayaNum}`;
    
    const tokenToUse = await getContentToken();

    const headers = {
      'x-client-id': CLIENT_ID
    };

    if (tokenToUse) {
      headers['x-auth-token'] = tokenToUse;
    }

    const response = await fetch(`${API_BASE_URL}/content/api/v4/verses/by_key/${normalizedKey}?language=ar&fields=text_uthmani`, {
      headers
    });
    if (response.ok) {
      const data = await response.json();
      if (data && data.verse && data.verse.text_uthmani) {
        verseTextCache[verseKey] = data.verse.text_uthmani;
        return data.verse.text_uthmani;
      }
    }
  } catch (e) {
    console.error(`Error fetching verse ${verseKey}:`, e);
  }

  return '۞...۞'; // Fallback text
}

async function buildVerseItemDOM(item) {
  const card = document.createElement('div');
  card.className = 'verse-item';

  const parts = item.verseKey.split(':');
  let surahNum = Number(parts[0]);
  const ayaNum = parts[1];

  if (isNaN(surahNum)) {
    const arabicName = parts[0];
    const foundKey = Object.keys(SURAH_NAMES).find(key => SURAH_NAMES[key] === arabicName);
    surahNum = foundKey ? Number(foundKey) : 1;
  }

  const surahName = SURAH_NAMES[surahNum] || `سورة ${surahNum}`;

  const header = document.createElement('div');
  header.className = 'verse-header';

  const title = document.createElement('span');
  title.className = 'verse-surah-aya';
  title.textContent = `${surahName} (${ayaNum})`;

  const time = document.createElement('span');
  time.className = 'verse-timestamp';
  time.textContent = formatTimeAgo(item.timestamp);

  header.appendChild(title);
  header.appendChild(time);

  const arabic = document.createElement('div');
  arabic.className = 'verse-arabic';
  arabic.textContent = '...';

  card.appendChild(header);
  card.appendChild(arabic);

  // Fetch Uthmani text asynchronously to avoid rendering lag
  getVerseUthmaniText(item.verseKey).then(text => {
    arabic.textContent = text;
  });

  return card;
}

function formatTimeAgo(timestamp) {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'الآن';
  if (mins < 60) return `منذ ${mins} د`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `منذ ${hours} س`;
  const days = Math.floor(hours / 24);
  return `منذ ${days} ي`;
}
