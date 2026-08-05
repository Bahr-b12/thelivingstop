(() => {
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];

  function setupCheckoutTerms() {
    qsa('[data-checkout-terms-form], .cart-page__form').forEach((form) => {
      const terms = qs('[data-checkout-terms-input]', form);
      const submit = qs('[data-checkout-submit]', form);
      const error = qs('[data-checkout-terms-error]', form);
      if (!terms || !submit || form.dataset.termsReady === 'true') return;
      form.dataset.termsReady = 'true';
      const syncTerms = () => {
        submit.disabled = !terms.checked;
        if (terms.checked && error) error.hidden = true;
      };
      terms.addEventListener('change', syncTerms);
      form.addEventListener('submit', (event) => {
        if (event.submitter?.name !== 'checkout' || terms.checked) return;
        event.preventDefault();
        if (error) error.hidden = false;
        terms.focus();
      });
      syncTerms();
    });
  }

  function setOpen(panel, open) {
    if (!panel) return;
    panel.classList.toggle('is-open', open);
    panel.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.documentElement.classList.toggle('drawer-open', open);
    qsa(`[aria-controls="${panel.id}"]`).forEach((trigger) => trigger.setAttribute('aria-expanded', String(open)));
    if (open) {
      const focusTarget = qs('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])', panel);
      focusTarget?.focus({ preventScroll: true });
    }
  }

  async function refreshCartDrawer() {
    const drawer = qs('[data-cart-drawer]');
    if (!drawer || !window.themeRoutes?.cart_section_url) return;
    const response = await fetch(window.themeRoutes.cart_section_url, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('Cart drawer refresh failed');
    const payload = await response.json();
    const html = payload['cart-drawer'];
    if (!html) return;
    const parsed = new DOMParser().parseFromString(html, 'text/html');
    const updated = qs('[data-cart-drawer]', parsed);
    if (updated) {
      drawer.replaceWith(updated);
      setupCheckoutTerms();
    }
  }

  document.addEventListener('click', async (event) => {
    const cartOpen = event.target.closest('[data-cart-open]');
    if (cartOpen) {
      event.preventDefault();
      setOpen(qs('#CartDrawer'), true);
      return;
    }
    if (event.target.closest('[data-cart-close]')) {
      setOpen(qs('#CartDrawer'), false);
      return;
    }
    if (event.target.closest('[data-menu-open]')) {
      setOpen(qs('#MobileMenu'), true);
      return;
    }
    if (event.target.closest('[data-menu-close]')) {
      setOpen(qs('#MobileMenu'), false);
      return;
    }
    const button = event.target.closest('[data-cart-qty], [data-cart-remove]');
    if (button) {
      const item = button.closest('[data-line]');
      if (!item) return;
      const line = Number(item.dataset.line);
      const qtyNode = item.querySelector('.cart-item__controls span');
      const current = Number(qtyNode?.textContent || 1);
      const next = button.hasAttribute('data-cart-remove') ? 0 : Math.max(0, current + Number(button.dataset.cartQty || 0));
      const status = qs('[data-cart-status]');
      button.disabled = true;
      if (status) status.textContent = 'Updating cart';
      try {
        const response = await fetch(window.themeRoutes.cart_change_url + '.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ line, quantity: next })
        });
        if (!response.ok) throw new Error('Cart update failed');
        window.location.reload();
      } catch (error) {
        if (status) status.textContent = 'Cart update failed. Please try again.';
        button.disabled = false;
      }
    }
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
        const addResponse = await fetch(window.themeRoutes.cart_add_url + '.js', {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        if (!addResponse.ok) throw new Error('Add to cart failed');
        const cart = await fetch(window.themeRoutes.cart_url + '.js').then((res) => res.json());
        qsa('[data-cart-count]').forEach((node) => { node.textContent = cart.item_count; });
        await refreshCartDrawer();
        setOpen(qs('#CartDrawer'), true);
        button.textContent = 'Added';
      } catch (error) {
        button.textContent = 'Unavailable';
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

  setupCheckoutTerms();

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
    const mobileSubmit = qs('[data-scroll-product-form]');
    form.addEventListener('change', () => {
      const selected = [1, 2, 3].map((position) => qs(`[data-option-position="${position}"]:checked`, form)?.value).filter(Boolean);
      const match = variants.find((variant) => selected.every((value, index) => variant.options[index] === value));
      if (!match) return;
      idInput.value = match.id;
      if (submit) {
        submit.disabled = !match.available;
        submit.textContent = match.available ? 'Add to cart' : 'Sold out';
      }
      if (mobileSubmit) {
        mobileSubmit.disabled = !match.available;
        mobileSubmit.classList.toggle('is-disabled', !match.available);
        mobileSubmit.textContent = match.available ? 'Add to cart' : 'Sold out';
      }
    });
  });

  function setupPageLoader() {
    const loader = qs('[data-page-loader]');
    if (!loader) return;
    const hide = () => loader.classList.add('is-hidden');
    window.addEventListener('load', hide, { once: true });
    window.setTimeout(hide, 2200);
  }

  function setupImpactQuote() {
    const layer = qs('[data-impact-quote]');
    if (!layer) return;
    const textNode = qs('[data-impact-quote-text]', layer);
    const primary = layer.dataset.impactQuotePrimary || 'Every piece helps fund food, shelter, and care.';
    const quotes = [primary, 'Wear well. Give back.'];
    const placeQuote = () => {
      const mobile = window.innerWidth <= 680;
      const left = mobile
        ? (Math.random() < 0.5 ? 38 + Math.random() * 6 : 56 + Math.random() * 6)
        : (Math.random() < 0.5 ? 36 + Math.random() * 6 : 58 + Math.random() * 6);
      const top = mobile
        ? (Math.random() < 0.5 ? 22 + Math.random() * 10 : 58 + Math.random() * 10)
        : (Math.random() < 0.5 ? 18 + Math.random() * 18 : 63 + Math.random() * 17);
      layer.style.setProperty('--impact-x', `${left}%`);
      layer.style.setProperty('--impact-y', `${top}%`);
    };
    placeQuote();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      textNode.textContent = primary;
      return;
    }
    let quoteIndex = 0;
    let characterIndex = 0;
    let deleting = false;
    const tick = () => {
      const quote = quotes[quoteIndex];
      textNode.textContent = quote.slice(0, characterIndex);
      if (!deleting && characterIndex < quote.length) {
        characterIndex += 1;
        window.setTimeout(tick, 28);
      } else if (!deleting) {
        deleting = true;
        window.setTimeout(tick, 1600 + Math.random() * 2200);
      } else if (characterIndex > 0) {
        characterIndex -= 1;
        window.setTimeout(tick, 16);
      } else {
        deleting = false;
        quoteIndex = (quoteIndex + 1) % quotes.length;
        placeQuote();
        window.setTimeout(tick, 500 + Math.random() * 1200);
      }
    };
    window.setTimeout(tick, 500 + Math.random() * 1400);
  }

  setupPageLoader();
  setupImpactQuote();
})();
