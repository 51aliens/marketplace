import React from 'react-dom';
import { createRoot } from 'react-dom/client';

import App from '@components/global/App';
import './styles';

const root = createRoot(document.getElementById('root')!);
(async () => {
  root.render(<App />);
})();
