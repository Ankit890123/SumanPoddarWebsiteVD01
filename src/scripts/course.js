/**
 * tecnosra - Suman Poddar - Course & Masterclass Application Logic
 */

import {
  initThemeToggle,
  initCursor,
  initTimecode,
  initNavigation,
  showToast
} from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  // Shared common features
  initThemeToggle();
  initCursor();
  initTimecode();
  initNavigation();

  // Course coming soon features (countdown & waitlist)
  initCourseComingSoon();
});

// Course Coming Soon Countdown & Pre-Registration
function initCourseComingSoon() {
  const daysEl = document.getElementById('cs-days');
  const hoursEl = document.getElementById('cs-hours');
  const minsEl = document.getElementById('cs-minutes');
  const secsEl = document.getElementById('cs-seconds');

  if (daysEl && hoursEl && minsEl && secsEl) {
    // Launch Date: October 15, 2025 18:00 UTC
    const launchDate = new Date('2025-10-15T18:00:00Z');

    function updateLaunchCountdown() {
      const now = new Date();
      let diff = launchDate.getTime() - now.getTime();
      if (diff <= 0) {
        // Fallback relative 24 days countdown
        diff = 24 * 86400000 + 14 * 3600000 + 38 * 60000;
      }

      const totalSec = Math.floor(diff / 1000);
      const days = Math.floor(totalSec / 86400);
      const hours = Math.floor((totalSec % 86400) / 3600);
      const mins = Math.floor((totalSec % 3600) / 60);
      const secs = totalSec % 60;

      daysEl.textContent = days.toString().padStart(2, '0');
      hoursEl.textContent = hours.toString().padStart(2, '0');
      minsEl.textContent = mins.toString().padStart(2, '0');
      secsEl.textContent = secs.toString().padStart(2, '0');
    }

    updateLaunchCountdown();
    setInterval(updateLaunchCountdown, 1000);
  }

  // Pre-registration form handler
  const form = document.getElementById('pre-register-form');
  const successEl = document.getElementById('waitlist-success');
  const emailInput = document.getElementById('waitlist-email');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!emailInput || !emailInput.value) return;
      const email = emailInput.value.trim();

      try {
        localStorage.setItem('reel_masterclass_waitlist', email);
      } catch (err) {
        // ignore localstorage errors
      }

      if (successEl) {
        successEl.classList.remove('hidden');
      }
      form.classList.add('opacity-80');
      showToast(`Pre-registered ${email}! 40% launch discount reserved.`);
    });
  }
}
