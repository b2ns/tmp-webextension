import chrome from './polyfill';

export const debounce = (fn: (...args: any[]) => any, wait = 300) => {
  let timer: ReturnType<typeof setTimeout>;
  return function debounced(this: Object, ...args: any[]) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, wait);
  };
};

export const nextTick = (fn: (...args: any[]) => any) => {
  Promise.resolve().then(fn);
};

export const stopPropagation = (e: any) => {
  e.stopPropagation();
};

export interface RequestOpts extends RequestInit {
  raw: boolean;
}
export const request = (url: string, opts: RequestOpts) => {
  return new Promise((resolve, reject) => {
    chrome.runtime
      .sendMessage({
        type: 'fetch',
        url,
        raw: opts.raw,
        opts,
      })
      .then((res: any) => {
        resolve(res.data);
      })
      .catch((e: Error) => {
        reject(e);
      });
  });
};
