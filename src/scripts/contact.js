/**
 * tecnosra - Suman Poddar - Contact & Booking Application Logic
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

  // Contact page specific modules
  initRateCalculator();
  initForms();
});

// 16. Studio Rate & Turnaround Estimator Calculator
function initRateCalculator() {
  const formatEl = document.getElementById('calc-format');
  const speedEl = document.getElementById('calc-speed');
  const finishEl = document.getElementById('calc-finish');
  const totalEl = document.getElementById('calculator-total-price');
  const timelineEl = document.getElementById('calculator-timeline-text');

  if (!formatEl || !speedEl || !finishEl || !totalEl) return;

  function calculate() {
    let base = 8000;
    if (formatEl.value === 'commercial_anthem') base = 12000;
    if (formatEl.value === 'music_video') base = 16000;
    if (formatEl.value === 'short_film') base = 24000;

    let finishCost = 0;
    if (finishEl.value === 'full_grade') finishCost = 3500;
    if (finishEl.value === 'full_suite') finishCost = 6500;

    let multiplier = 1.0;
    let timelineText = "Turnaround: 10–14 Business Days";
    if (speedEl.value === 'priority') {
      multiplier = 1.25;
      timelineText = "Turnaround: 5–7 Business Days (Priority)";
    } else if (speedEl.value === 'emergency') {
      multiplier = 1.6;
      timelineText = "Turnaround: 72-Hour Emergency Picture Lock";
    }

    const total = Math.round((base + finishCost) * multiplier);
    totalEl.textContent = `$${total.toLocaleString()}`;
    if (timelineEl) timelineEl.textContent = timelineText;
  }

  formatEl.addEventListener('change', calculate);
  speedEl.addEventListener('change', calculate);
  finishEl.addEventListener('change', calculate);

  calculate();

  window.applyCalculatorToBrief = function() {
    const total = totalEl.textContent;
    const formatName = formatEl.options[formatEl.selectedIndex].text;
    const speedName = speedEl.options[speedEl.selectedIndex].text;
    const finishName = finishEl.options[finishEl.selectedIndex].text;

    const notes = document.getElementById('contact-notes');
    if (notes) {
      notes.value = `[BUDGET ESTIMATE SPECIFICATION]\nTotal Estimated Rate: ${total}\nDeliverable: ${formatName}\nTurnaround: ${speedName}\nFinishing Suite: ${finishName}\n\nProject Synopsis & Notes:\n`;
      notes.focus();
    }
    showToast(`Specification applied (${total}). Fill in creative brief below.`);
  };
}

// 10. Forms & Interactions
function initForms() {
  // Newsletter form
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.value) {
        showToast(`Subscribed ${input.value} to Screening Suite Signals.`);
        input.value = '';
      }
    });
  });

  // Contact form
  const contactForm = document.getElementById('contact-inquiry-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name')?.value || 'Director';
      showToast(`Inquiry received from ${name}. Studio coordinator will reach out within 2 hours.`);
      contactForm.reset();
    });
  }
}
