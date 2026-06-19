import { syncAppViewportHeight } from '@/utils';

syncAppViewportHeight();

window.addEventListener('resize', syncAppViewportHeight);
window.visualViewport?.addEventListener('resize', syncAppViewportHeight);
window.addEventListener('orientationchange', syncAppViewportHeight);
