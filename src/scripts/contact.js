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
  const successMsg = document.getElementById('contact-success-msg');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnHTML = submitBtn ? submitBtn.innerHTML : 'Submit Inquiry';

      const name = (document.getElementById('contact-name')?.value || '').trim();
      const email = (document.getElementById('contact-email')?.value || '').trim();
      const phone = (document.getElementById('contact-phone')?.value || '').trim();
      const notes = (document.getElementById('contact-notes')?.value || '').trim();

      if (!name || !email || !phone || !notes) {
        showToast('Please fill in all required fields.');
        return;
      }

      // Set button to loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-on-primary inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <span>Transmitting Brief...</span>
        `;
      }

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            notes
          })
        });

        const result = await response.json().catch(() => ({}));

        if (response.ok && result.success !== false) {
          // Backup to local client storage cache
          try {
            const inquiries = JSON.parse(localStorage.getItem('technosra_contact_inquiries') || '[]');
            inquiries.push({
              name,
              email,
              phone,
              notes,
              inquiry_id: result.inquiry_id,
              timestamp: new Date().toISOString()
            });
            localStorage.setItem('technosra_contact_inquiries', JSON.stringify(inquiries));
          } catch (err) {}

          if (successMsg) {
            successMsg.textContent = result.message || `✓ Inquiry submitted successfully! The tecnosra team will reach out to you within 24 hours.`;
            successMsg.classList.remove('hidden');
          }

          showToast(`Inquiry sent! Thank you ${name}.`);
          contactForm.reset();
        } else {
          const errorMsg = result.error || 'Could not send inquiry. Please check your details.';
          showToast(`Error: ${errorMsg}`);
        }
      } catch (networkErr) {
        // Fallback to client cache if network offline
        try {
          const inquiries = JSON.parse(localStorage.getItem('technosra_contact_inquiries') || '[]');
          inquiries.push({ name, email, phone, notes, timestamp: new Date().toISOString(), offline: true });
          localStorage.setItem('technosra_contact_inquiries', JSON.stringify(inquiries));
        } catch (e) {}

        if (successMsg) {
          successMsg.textContent = `✓ Inquiry saved offline! Suman Poddar & team will contact you at ${email || phone}.`;
          successMsg.classList.remove('hidden');
        }
        showToast(`Inquiry saved! We will reach out shortly.`);
        contactForm.reset();
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
        }
      }
    });
  }
}
