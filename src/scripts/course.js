/**
 * tecnosra - Suman Poddar - Course & Masterclass Application Logic
 */

import {
  initThemeToggle,
  initCursor,
  initTimecode,
  initNavigation,
  initCurriculumModal,
  showToast,
  setupWiper
} from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  // Shared common features
  initThemeToggle();
  initCursor();
  initTimecode();
  initNavigation();
  initCurriculumModal();

  // Course page specific modules
  initCourseWiper();
  initCourseComingSoon();
  initCritiqueCountdown();
  initFAQ();
});

function initCourseWiper() {
  setupWiper('course-wipe-container', 'course-wipe-raw', 'course-wipe-handle');
}

// 12b. Course Coming Soon Countdown & Pre-Registration
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

  // Course Contact / Inquiry Form Handler
  const inquiryForm = document.getElementById('course-inquiry-form');
  const inquirySuccess = document.getElementById('course-inquiry-success');
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (document.getElementById('course-contact-name')?.value || '').trim();
      const email = (document.getElementById('course-contact-email')?.value || '').trim();
      const topic = document.getElementById('course-contact-topic')?.value || 'early-bird';

      if (!name || !email) {
        showToast('Please enter your name and email.');
        return;
      }

      try {
        const inquiries = JSON.parse(localStorage.getItem('reel_course_inquiries') || '[]');
        inquiries.push({ name, email, topic, timestamp: new Date().toISOString() });
        localStorage.setItem('reel_course_inquiries', JSON.stringify(inquiries));
      } catch (err) {
        // ignore storage error
      }

      if (inquirySuccess) {
        inquirySuccess.classList.remove('hidden');
      }
      inquiryForm.classList.add('opacity-70');
      showToast(`Inquiry sent for ${name}! 40% discount reserved.`);
    });
  }
}

// 12. Live Editorial Critique Real-Time Countdown Timer
function initCritiqueCountdown() {
  const hoursEl = document.getElementById('countdown-hours');
  const minutesEl = document.getElementById('countdown-minutes');
  const secondsEl = document.getElementById('countdown-seconds');
  if (!hoursEl || !minutesEl || !secondsEl) return;

  function updateTimer() {
    const now = new Date();
    // Calculate target next Saturday 10:00 AM PST (18:00 UTC)
    const day = now.getUTCDay();
    let daysUntilSat = (6 - day + 7) % 7;
    if (daysUntilSat === 0 && now.getUTCHours() >= 18) {
      daysUntilSat = 7;
    }
    const target = new Date(now);
    target.setUTCDate(now.getUTCDate() + daysUntilSat);
    target.setUTCHours(18, 0, 0, 0);

    const diff = Math.max(0, target.getTime() - now.getTime());
    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    hoursEl.textContent = hours.toString().padStart(2, '0');
    minutesEl.textContent = minutes.toString().padStart(2, '0');
    secondsEl.textContent = seconds.toString().padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

// 7. Course Master Modules Filtering & FAQ Accordion
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const toggle = item.querySelector('.faq-toggle');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');

    if (!toggle || !content) return;

    toggle.addEventListener('click', () => {
      const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';

      // Close all
      document.querySelectorAll('.faq-content').forEach(c => c.style.maxHeight = null);
      document.querySelectorAll('.faq-icon').forEach(i => i.style.transform = 'rotate(0deg)');

      if (!isOpen) {
        content.style.maxHeight = content.scrollHeight + 'px';
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });

  // Course Module Filters
  const courseFilterBtns = document.querySelectorAll('.course-filter-btn');
  const courseCards = document.querySelectorAll('.course-card');

  courseFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      courseFilterBtns.forEach(b => {
        b.classList.remove('bg-primary-container', 'text-on-primary');
        b.classList.add('text-on-surface-variant');
      });
      btn.classList.remove('text-on-surface-variant');
      btn.classList.add('bg-primary-container', 'text-on-primary');

      const filter = btn.getAttribute('data-filter');
      courseCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}
