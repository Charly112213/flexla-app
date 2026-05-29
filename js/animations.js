const Animations = {

  countUp(el, target, duration = 800, suffix = '') {
    if (!el) return;
    const start = performance.now();
    const update = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target).toLocaleString('fr-FR') + suffix;
      if (p < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  },

  stagger(selector, delay = 40) {
    const items = document.querySelectorAll(selector);
    items.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(10px)';
      el.style.transition = 'none';
      setTimeout(() => {
        el.style.transition = `opacity 300ms var(--ease-out), transform 300ms var(--ease-out)`;
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, i * delay);
    });
  },

  fadeIn(el, delay = 0) {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(-6px)';
    el.style.transition = 'none';
    setTimeout(() => {
      el.style.transition = `opacity 300ms var(--ease-out), transform 300ms var(--ease-out)`;
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, delay);
  },

  fadeInUp(el, delay = 0) {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    el.style.transition = 'none';
    setTimeout(() => {
      el.style.transition = `opacity 320ms var(--ease-out), transform 320ms var(--ease-out)`;
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, delay);
  },

  fadeInTeslaBar(el, delay = 0) {
    if (!el) return;
    el.style.opacity = '0';
    setTimeout(() => {
      el.style.transition = `opacity 400ms var(--ease-out)`;
      el.style.opacity = '1';
    }, delay);
  },

  initDashboard() {
    const header  = document.querySelector('#page-dashboard .header');
    const banner  = document.querySelector('#page-dashboard .banner');
    const cards   = '#page-dashboard .card';
    const tesla   = document.querySelector('#page-dashboard .tesla-bar');
    const amountEl = document.querySelector('.banner-amount-val');

    this.fadeIn(header, 0);
    this.fadeInUp(banner, 80);
    this.stagger(cards, 40);
    this.fadeInTeslaBar(tesla, 280 + 6 * 40 + 60);

    if (amountEl) {
      setTimeout(() => {
        this.countUp(amountEl, Data.echeance.montant, 800, ' €');
      }, 200);
    }
  },

};
