chrome.runtime.onInstalled.addListener((): void => {
  console.log('Extension installed');
});

chrome.runtime.onMessage.addListener(
  (request: any, sender: any, sendResponse: any) => {
    if (request.type === 'fetch') {
      // fetch here to bypass SOP
      fetch(request.url, request.opts)
        .then((res) => {
          (request.raw ? res.text() : res.json()).then((data) => {
            sendResponse({ data });
          });
        })
        .catch((e) => {
          sendResponse({ data: null });
        });
    }

    // enable async
    return true;
  }
);

export {};
