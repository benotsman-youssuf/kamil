'use strict';

chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.query({ active: true }, (tabs) => {
    tabs.forEach((tab) => {
      chrome.tabs.sendMessage(tab.id, { type: 'PRELOAD' }).catch(() => {});
    });
  });
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'sync') return;
  if (!changes.kamilEnabled) return;
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      chrome.tabs.sendMessage(tab.id, {
        type: 'ENABLED_CHANGED',
        enabled: changes.kamilEnabled.newValue !== false,
      }).catch(() => {});
    });
  });
});
