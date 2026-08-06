(() => {
  const page = document.querySelector('[data-launch-page]');
  const countdown = document.querySelector('[data-launch-countdown]');
  if (!page || !countdown) return;

  const target = new Date(page.dataset.launchDate).getTime();
  const units = { days: 86400000, hours: 3600000, minutes: 60000, seconds: 1000 };
  const update = () => {
    let remaining = Math.max(0, target - Date.now());
    Object.entries(units).forEach(([name, duration]) => {
      const value = Math.floor(remaining / duration);
      remaining %= duration;
      const node = countdown.querySelector('[data-unit="' + name + '"]');
      if (node) node.textContent = String(value).padStart(2, '0');
    });
    if (target <= Date.now()) {
      countdown.setAttribute('aria-label', 'Launch is live');
      window.clearInterval(timer);
    }
  };
  let timer;
  update();
  timer = window.setInterval(update, 1000);

  document.querySelectorAll('form').forEach((form) => {
    const consent = form.querySelector('input[type="checkbox"]');
    const submit = form.querySelector('button[type="submit"]');
    if (!submit) return;
    const sync = () => { submit.disabled = Boolean(consent && !consent.checked); };
    consent?.addEventListener('change', sync);
    form.addEventListener('submit', () => { submit.disabled = true; submit.textContent = 'Joining...'; });
    sync();
  });
})();
