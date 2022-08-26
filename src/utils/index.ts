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

export interface RequestOpts extends RequestInit {
  raw: boolean;
}
export const request = (url: string, opts: RequestOpts) => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type: 'fetch',
        url,
        raw: opts.raw,
        opts,
      },
      (res: { data: any }) => {
        let { data } = res;
        if (data) {
          resolve(data);
        } else {
          reject();
        }
      }
    );
  });
};
