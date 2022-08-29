import chrome from '~/utils/polyfill';
import { createRoot } from 'react-dom/client';
import App from './App';

(() => {
  const container = document.createElement('div');
  const shadowDOM =
    container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' }) ||
    container;
  const styleEl = document.createElement('link');
  styleEl.setAttribute('rel', 'stylesheet');
  styleEl.setAttribute(
    'href',
    chrome.runtime.getURL('dist/contentScripts/index.global.css')
  );
  const root = document.createElement('div');

  shadowDOM.appendChild(styleEl);
  shadowDOM.appendChild(root);
  document.body.appendChild(container);

  createRoot(root).render(<App />);
})();
