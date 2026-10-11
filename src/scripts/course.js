/**
 * tecnosra - Suman Poddar - Course & Masterclass Application Logic
 */

import {
  initThemeToggle,
  initCursor,
  initTimecode,
  initNavigation
} from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  // Shared common features
  initThemeToggle();
  initCursor();
  initTimecode();
  initNavigation();
});
