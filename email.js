/**
 * ==========================================================================
 * NAGAR ASSOCIATES – EMAILJS INTEGRATION MODULE
 * Client-Side Inquiry & Consultation Email Dispatcher
 * ==========================================================================
 */

(function () {
  'use strict';

  // Default configuration (Replace with your actual EmailJS credentials)
  // You can also update these directly via the UI Configuration Modal
  const DEFAULT_CONFIG = {
    serviceId: "service_ipj9p77",      // Your EmailJS Service ID
    templateId: "template_dm2gm1i",   // Your EmailJS Template ID
    publicKey: "TyF3lcRjF5JPvlBXj"   // Your EmailJS Public Key
  };

  /**
   * Retrieve active EmailJS configuration (local storage override or defaults)
   */
  function getConfig() {
    try {
      const stored = localStorage.getItem('nagar_emailjs_config');
      if (stored) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Could not read emailjs config from localStorage', e);
    }
    return DEFAULT_CONFIG;
  }

  /**
   * Save custom configuration to localStorage
   */
  function saveConfig(serviceId, templateId, publicKey) {
    const cfg = {
      serviceId: serviceId.trim() || DEFAULT_CONFIG.serviceId,
      templateId: templateId.trim() || DEFAULT_CONFIG.templateId,
      publicKey: publicKey.trim() || DEFAULT_CONFIG.publicKey
    };
    localStorage.setItem('nagar_emailjs_config', JSON.stringify(cfg));
    initEmailJS();
    return cfg;
  }

  /**
   * Initialize EmailJS SDK if available
   */
  function initEmailJS() {
    const config = getConfig();
    if (window.emailjs && config.publicKey && config.publicKey !== "YOUR_EMAILJS_PUBLIC_KEY") {
      try {
        window.emailjs.init({
          publicKey: config.publicKey
        });
        console.log('✅ EmailJS initialized successfully with Public Key.');
      } catch (err) {
        console.error('EmailJS initialization error:', err);
      }
    }
  }

  /**
   * Show toast notification
   */
  function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <svg class="ico" viewBox="0 0 24 24">
        ${type === 'success' 
          ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3"/>'
          : '<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>'}
      </svg>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 4000);
  }

  /**
   * Validate Indian / International phone numbers
   */
  function isValidPhone(phone) {
    const clean = phone.replace(/[\s\-\(\)]/g, '');
    return /^(?:\+?91)?[6-9]\d{9}$/.test(clean) || /^\+?\d{8,15}$/.test(clean);
  }

  /**
   * Validate email format
   */
  function isValidEmail(email) {
    if (!email) return true; // email is optional in this form
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /**
   * Form Submission Handler
   */
  function setupFormHandler() {
    const form = document.getElementById('form');
    if (!form) return;

    const statusBanner = document.getElementById('ok');
    const submitBtn = form.querySelector('.send-btn');
    const config = getConfig();

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Retrieve form inputs
      const nameInput = form.elements['n'];
      const phoneInput = form.elements['p'];
      const emailInput = form.elements['e'];
      const serviceSelect = form.elements['s'];
      const messageInput = form.elements['m'];

      const name = nameInput ? nameInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const service = serviceSelect ? serviceSelect.value : '';
      const message = messageInput ? messageInput.value.trim() : '';

      // Validation
      if (!name || name.length < 2) {
        showToast('Please enter your full name.', 'error');
        nameInput && nameInput.focus();
        return;
      }

      if (!phone || !isValidPhone(phone)) {
        showToast('Please enter a valid 10-digit mobile number.', 'error');
        phoneInput && phoneInput.focus();
        return;
      }

      if (email && !isValidEmail(email)) {
        showToast('Please enter a valid email address.', 'error');
        emailInput && emailInput.focus();
        return;
      }

      if (!service) {
        showToast('Please select a legal service.', 'error');
        serviceSelect && serviceSelect.focus();
        return;
      }

      // Prepare payload
      const templateParams = {
        to_name: "Nagar Associates Legal Team",
        from_name: name,
        reply_to: email || "Not provided",
        phone_number: phone,
        service_requested: service,
        message: message || "No additional notes provided.",
        submission_time: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
      };

      // Button loading state
      if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
      }

      const isLiveConfig = window.emailjs && 
                           config.publicKey && 
                           config.publicKey !== "YOUR_EMAILJS_PUBLIC_KEY" &&
                           config.serviceId && 
                           config.serviceId !== "service_nagar_legal";

      try {
        if (isLiveConfig) {
          // Live EmailJS dispatch
          await window.emailjs.send(config.serviceId, config.templateId, templateParams);
          console.log('✅ EmailJS sent inquiry successfully:', templateParams);
        } else {
          // Simulated demo dispatch with realistic delay
          await new Promise(resolve => setTimeout(resolve, 800));
          console.info('ℹ️ EmailJS Demo Mode: Form payload prepared:', templateParams);
        }

        // Success UI Feedback
        if (statusBanner) {
          statusBanner.className = 'form-status show success';
          statusBanner.innerHTML = `
            <svg class="ico" viewBox="0 0 24 24" style="color:#059669">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3"/>
            </svg>
            <div>
              <strong>Consultation Request Received!</strong><br>
              Thank you, <b>${name}</b>. We have recorded your request for <b>${service}</b>. Our senior advocate will contact you at <b>${phone}</b> within 24 hours.
              ${!isLiveConfig ? '<br><small style="color:#047857;margin-top:4px;display:inline-block">⚡ (Demo Mode: EmailJS is ready to connect with your live keys)</small>' : ''}
            </div>
          `;
        }

        showToast('Consultation request sent successfully!', 'success');
        form.reset();

      } catch (error) {
        console.error('EmailJS submission error:', error);
        if (statusBanner) {
          statusBanner.className = 'form-status show error';
          statusBanner.innerHTML = `
            <svg class="ico" viewBox="0 0 24 24" style="color:#DC2626">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
            </svg>
            <div>
              <strong>Dispatch Issue:</strong><br>
              ${error && error.text ? error.text : 'Could not send email automatically. Please reach us directly via call or WhatsApp at +91 88268 61146.'}
            </div>
          `;
        }
        showToast('Failed to dispatch. Please call or WhatsApp us.', 'error');
      } finally {
        if (submitBtn) {
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
        }
      }
    });
  }

  /**
   * EmailJS Configuration Modal UI Handler
   */
  function setupConfigModal() {
    const modal = document.getElementById('emailjs-modal');
    const openBtn = document.getElementById('open-emailjs-config');
    const closeBtn = document.getElementById('close-emailjs-config');
    const cancelBtn = document.getElementById('cancel-emailjs-config');
    const saveBtn = document.getElementById('save-emailjs-config');

    if (!modal) return;

    function openModal() {
      const current = getConfig();
      const sInput = document.getElementById('cfg-service-id');
      const tInput = document.getElementById('cfg-template-id');
      const kInput = document.getElementById('cfg-public-key');

      if (sInput) sInput.value = current.serviceId || '';
      if (tInput) tInput.value = current.templateId || '';
      if (kInput) kInput.value = current.publicKey || '';

      modal.classList.add('open');
    }

    function closeModal() {
      modal.classList.remove('open');
    }

    openBtn && openBtn.addEventListener('click', openModal);
    closeBtn && closeBtn.addEventListener('click', closeModal);
    cancelBtn && cancelBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });

    saveBtn && saveBtn.addEventListener('click', function () {
      const sVal = document.getElementById('cfg-service-id').value;
      const tVal = document.getElementById('cfg-template-id').value;
      const kVal = document.getElementById('cfg-public-key').value;

      saveConfig(sVal, tVal, kVal);
      closeModal();
      showToast('EmailJS configuration saved!', 'success');
    });
  }

  // Self Initialization on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initEmailJS();
      setupFormHandler();
      setupConfigModal();
    });
  } else {
    initEmailJS();
    setupFormHandler();
    setupConfigModal();
  }

  // Export functions to global scope for developer access
  window.NagarEmailJS = {
    getConfig,
    saveConfig,
    showToast
  };
})();
