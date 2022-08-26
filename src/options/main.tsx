import { createRoot } from 'react-dom/client';
import App from './Options';

const app = createRoot(document.querySelector('#app')!);
app.render(<App />);
