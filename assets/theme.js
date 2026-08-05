(() => {
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];

  function setOpen(panel, open) {
    if (!panel) return;
    panel.classList.toggle('is-open', open);
    panel.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.documentElement.classList.toggle('drawer-open', open);
  }

  qsa('[data-cart-open]').forEach((button) => button.addEventListener('click', () => setOpen(qs('#CartDrawer'), true)));
  qsa('[data-cart-close]').forEach((button) => button.addEventListener('click', () => setOpen(qs('#CartDrawer'), false)));
  qsa('[data-menu-open]').forEach((button) => button.addEventListener('click', () => setOpen(qs('#MobileMenu'), true)));
  qsa('[data-menu-close]').forEach((button) => button.addEventListener('click', () => setOpen(qs('#MobileMenu'), false)));

  qsa('[data-cart-qty], [data-cart-remove]').forEach((button) => {
    button.addEventListener('click', async () => {
      const item = button.closest('[data-line]');
      if (!item) return;
      const line = Number(item.dataset.line);
      const qtyNode = item.querySelector('.cart-item__controls span');
      const current = Number(qtyNode?.textContent || 1);
      const next = button.hasAttribute('data-cart-remove') ? 0 : Math.max(0, current + Number(button.dataset.cartQty || 0));
      button.disabled = true;
      await fetch(window.themeRoutes.cart_change_url + '.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ line, quantity: next })
      });
      window.location.reload();
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setOpen(qs('#CartDrawer'), false);
      setOpen(qs('#MobileMenu'), false);
    }
  });

  qsa('.quick-add').forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const button = qs('button', form);
      button.disabled = true;
      button.textContent = 'Adding';
      try {
        await fetch(window.themeRoutes.cart_add_url + '.js', {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        const cart = await fetch(window.themeRoutes.cart_url + '.js').then((res) => res.json());
        qsa('[data-cart-count]').forEach((node) => { node.textContent = cart.item_count; });
        setOpen(qs('#CartDrawer'), true);
        button.textContent = 'Added';
      } catch (error) {
        button.textContent = 'Try again';
      } finally {
        setTimeout(() => {
          button.disabled = false;
          button.textContent = 'Quick add';
        }, 1200);
      }
    });
  });

  const filterForm = qs('#CollectionFilters');
  if (filterForm) {
    filterForm.addEventListener('change', () => filterForm.submit());
  }

  const mobileAtc = qs('[data-scroll-product-form]');
  if (mobileAtc) {
    mobileAtc.addEventListener('click', () => qs('.product-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
  }

  qsa('.product-form').forEach((form) => {
    const variantScript = qs('[data-product-variants]', form);
    if (!variantScript) return;
    let variants = [];
    try {
      variants = JSON.parse(variantScript.textContent || '[]');
    } catch (error) {
      return;
    }
    const idInput = qs('input[name="id"]', form);
    const submit = qs('button[type="submit"]', form);
    form.addEventListener('change', () => {
      const selected = [1, 2, 3].map((position) => qs(`[data-option-position="${position}"]:checked`, form)?.value).filter(Boolean);
      const match = variants.find((variant) => selected.every((value, index) => variant.options[index] === value));
      if (!match) return;
      idInput.value = match.id;
      if (submit) {
        submit.disabled = !match.available;
        submit.textContent = match.available ? 'Add to cart' : 'Sold out';
      }
    });
  });

  function setupFullStopLayer() {
    const layer = qs('[data-full-stop-layer]');
    if (!layer || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const page = document.body.className.replace('template-', '').split(/\s+/)[0];
    const allowed = (layer.dataset.pages || '').split(',').map((item) => item.trim()).filter(Boolean);
    if (allowed.length && !allowed.includes(page)) return;
    const assets = [
      { type: 'image', src: assetUrl('animation.svg') },
      { type: 'image', src: assetUrl('animation-2.svg') },
      { type: 'video', src: assetUrl('animation.mp4') },
      { type: 'video', src: assetUrl('animation-2.mp4') }
    ];
    const min = Number(layer.dataset.min || 4) * 1000;
    const max = Number(layer.dataset.max || 12) * 1000;
    const maxSize = Number(layer.dataset.size || 56);
    const reduced = /product|cart/.test(page) ? 1.8 : 1;

    function assetUrl(filename) {
      const probe = qs(`link[href*="theme.css"]`)?.href || '';
      return probe.replace(/theme\.css.*/, filename);
    }

    function blockedZone(x, y) {
      return y < 110 || y > window.innerHeight - 120 || x > window.innerWidth - 180 && y < 180;
    }

    function spawn() {
      const pick = assets[Math.floor(Math.random() * assets.length)];
      const size = Math.max(18, Math.min(maxSize, window.innerWidth * 0.11) * (0.55 + Math.random() * 0.45));
      let x = Math.random() * (window.innerWidth - size);
      let y = Math.random() * (window.innerHeight - size);
      for (let i = 0; i < 6 && blockedZone(x, y); i += 1) {
        x = Math.random() * (window.innerWidth - size);
        y = Math.random() * (window.innerHeight - size);
      }
      const node = document.createElement('span');
      node.className = 'full-stop-pop';
      node.style.left = `${x}px`;
      node.style.top = `${y}px`;
      node.style.width = `${size}px`;
      node.style.height = `${size}px`;
      node.style.animationDuration = `${500 + Math.random() * 900}ms`;
      if (pick.type === 'image') {
        const img = document.createElement('img');
        img.alt = '';
        img.src = pick.src;
        node.appendChild(img);
      } else {
        const video = document.createElement('video');
        video.src = pick.src;
        video.muted = true;
        video.playsInline = true;
        video.autoplay = true;
        node.appendChild(video);
      }
      layer.appendChild(node);
      setTimeout(() => node.remove(), 1500);
      schedule();
    }

    function schedule() {
      const delay = (min + Math.random() * Math.max(1000, max - min)) * reduced;
      window.setTimeout(spawn, delay);
    }
    schedule();
  }

  setupFullStopLayer();
})();
