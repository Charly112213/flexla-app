const Router = {
  current: 'page-connexion',
  history: [],

  navigate(pageId) {
    const currentEl = document.getElementById(this.current);
    const nextEl    = document.getElementById(pageId);
    if (!nextEl || this.current === pageId) return;

    // Sort out current page
    if (currentEl) {
      currentEl.classList.remove('active', 'slide-in');
      currentEl.classList.add('slide-out-left');
      setTimeout(() => {
        currentEl.classList.remove('slide-out-left');
      }, 320);
    }

    // Bring in next page
    nextEl.style.transform = 'translateX(100%)';
    nextEl.style.opacity   = '0';
    nextEl.classList.add('active');
    nextEl.getBoundingClientRect(); // force reflow
    nextEl.classList.add('slide-in');
    nextEl.style.transform = '';
    nextEl.style.opacity   = '';

    this.history.push(this.current);
    this.current = pageId;

    this._updateNavBar(pageId);
    this._onPageEnter(pageId);
  },

  back() {
    const prev = this.history.pop();
    if (!prev) return;

    const currentEl = document.getElementById(this.current);
    const prevEl    = document.getElementById(prev);

    if (currentEl) {
      currentEl.classList.add('slide-out-right');
      setTimeout(() => {
        currentEl.classList.remove('active', 'slide-out-right', 'slide-in');
      }, 280);
    }

    if (prevEl) {
      prevEl.style.transform = 'translateX(-28%)';
      prevEl.style.opacity   = '0';
      prevEl.classList.add('active');
      prevEl.getBoundingClientRect();
      prevEl.classList.add('slide-in');
      prevEl.style.transform = '';
      prevEl.style.opacity   = '';
    }

    this.current = prev;
    this._updateNavBar(prev);
  },

  _updateNavBar(pageId) {
    const map = {
      'page-dashboard':           'nav-accueil',
      'page-mon-compte':          'nav-compte',
      'page-mon-contrat':         'nav-contrat',
      'page-mes-echeances':       'nav-echeances',
      'page-suivi-vehicule':      'nav-entretiens',
      'page-mes-factures':        'nav-factures',
    };
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const navId = map[pageId];
    if (navId) document.getElementById(navId)?.classList.add('active');
  },

  _onPageEnter(pageId) {
    if (pageId === 'page-dashboard') {
      setTimeout(() => Animations.initDashboard(), 50);
    }
    if (pageId !== 'page-dashboard') {
      const cards = `#${pageId} .doc-card, #${pageId} .card`;
      setTimeout(() => Animations.stagger(cards, 40), 80);
    }
  },

  init() {
    // Connexion submit
    const form = document.getElementById('form-connexion');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.navigate('page-dashboard');
      });
    }

    // Back buttons
    document.querySelectorAll('.back-btn').forEach(btn => {
      btn.addEventListener('click', () => this.back());
    });

    // Nav bar
    document.querySelectorAll('.nav-item[data-page]').forEach(item => {
      item.addEventListener('click', () => {
        this.navigate(item.dataset.page);
      });
    });

    // Dashboard cards
    document.querySelectorAll('.card[data-page]').forEach(card => {
      card.addEventListener('click', () => {
        this.navigate(card.dataset.page);
      });
    });

    // Init connexion animations
    document.querySelectorAll('.fade-up').forEach((el, i) => {
      el.style.animationDelay = `${i * 80}ms`;
    });
  },
};

document.addEventListener('DOMContentLoaded', () => Router.init());
