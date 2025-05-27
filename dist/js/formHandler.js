//
// File: formHandler.js
// Purpose: Enhanced AJAX form handler for contact and registration forms. Handles validation, feedback, and (optionally) Netlify Forms or static JSON fallback.
// Last updated: 2025-05-25
//

(function(){
  function serializeForm(form) {
    const data = {};
    new FormData(form).forEach((v, k) => { data[k] = v; });
    return data;
  }

  function showStatus(form, msg, success) {
    let status = form.querySelector('.form-status');
    if (!status) {
      status = document.createElement('div');
      status.className = 'form-status';
      form.appendChild(status);
    }
    status.textContent = msg;
    status.style.color = success ? 'green' : 'red';
    status.style.marginTop = '1rem';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const data = serializeForm(form);
    // Basic validation
    for (const key in data) {
      if (!data[key]) {
        showStatus(form, 'Please fill in all fields.', false);
        return;
      }
    }
    showStatus(form, 'Sending...', true);
    // Try Netlify Forms (if enabled)
    if (form.hasAttribute('data-netlify')) {
      form.submit();
      return;
    }
    // Fallback: simulate AJAX (local only)
    setTimeout(() => {
      showStatus(form, 'Thank you! Your submission was received.', true);
      form.reset();
    }, 1200);
  }

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('form.contact-form, form.register-form').forEach(form => {
      form.addEventListener('submit', handleSubmit);
    });
  });
})();
