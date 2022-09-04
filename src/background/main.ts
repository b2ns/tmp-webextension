import { DICT_HREF } from '~/constants';
import chrome from '~/utils/polyfill';

chrome.runtime.onInstalled.addListener((): void => {
  chrome.contextMenus.create({
    id: 'translate',
    title: '翻译 "%s"',
    contexts: ['selection'],
    documentUrlPatterns: ['<all_urls>'],
    visible: true,
  });

  console.log('Extension: Translate installed');
});

chrome.runtime.onMessage.addListener(
  (request: any, sender: any, sendResponse: any) => {
    if (request.type === 'fetch') {
      // fetch here to bypass SOP
      const { timeout = 8000 } = request.opts;
      const controller = new AbortController();
      let timer = setTimeout(() => {
        controller.abort();
      }, timeout);

      fetch(request.url, { ...request.opts, signal: controller.signal })
        .then((res) => {
          clearTimeout(timer);
          (request.raw ? res.text() : res.json()).then((data) => {
            sendResponse({ data });
          });
        })
        .catch((e) => {
          clearTimeout(timer);
          sendResponse({});
        });
    }

    // enable async
    return true;
  }
);

chrome.contextMenus.onClicked.addListener((info: any, tabs: any) => {
  chrome.tabs.create({
    index: tabs.index + 1,
    url: `${DICT_HREF}${encodeURIComponent(info.selectionText.trim())}`,
  });
});

export {};
