import { createRoot } from 'react-dom/client';
import App from './Popup';

const app = createRoot(document.querySelector('#app')!);
app.render(<App />);
