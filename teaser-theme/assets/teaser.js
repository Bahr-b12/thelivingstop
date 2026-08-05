(() => {
  document.querySelectorAll('form').forEach((form) => {
    const email = form.querySelector('input[type="email"]');
    const consent = form.querySelector('input[type="checkbox"]');
    const submit = form.querySelector('button[type="submit"]');
    if (!email || !submit) return;
    const sync = () => { submit.disabled = Boolean(consent && !consent.checked); };
    consent?.addEventListener('change', sync);
    form.addEventListener('submit', () => { submit.disabled = true; submit.textContent = 'Joining...'; });
    sync();
  });
})();
