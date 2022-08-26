import { useEffect } from 'react';

type EventListenerParams = Parameters<typeof addEventListener>;

export const useEventListener = (
  el: Node,
  type: EventListenerParams[0],
  handler: EventListenerParams[1],
  opts?: EventListenerParams[2]
): void => {
  useEffect(() => {
    el.addEventListener(type, handler, opts);
    return () => {
      el.removeEventListener(type, handler, opts);
    };
  }, []);
};
