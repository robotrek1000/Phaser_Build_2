import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '@/components/app';
import { setBaseCssVariables, syncAppViewportHeight } from '@/utils';
import './index.css';

setBaseCssVariables();
syncAppViewportHeight();

window.addEventListener('resize', syncAppViewportHeight);
window.visualViewport?.addEventListener('resize', syncAppViewportHeight);
window.addEventListener('orientationchange', syncAppViewportHeight);

createRoot(document.getElementById('root') ?? document.body).render(
  <StrictMode>
    <App />
  </StrictMode>
);
