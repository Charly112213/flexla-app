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

    nextEl.scrollTop = 0;
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
    const navbar = document.querySelector('.navbar');
    if (pageId === 'page-connexion' || pageId === 'page-dashboard') {
      navbar.style.display = 'none';
      return;
    }
    navbar.style.display = 'flex';
    const map = {
      'page-dashboard':      'nav-accueil',
      'page-mon-compte':     'nav-compte',
      'page-mon-contrat':    'nav-contrat',
      'page-mes-echeances':  'nav-echeances',
      'page-suivi-vehicule': 'nav-entretiens',
      'page-mes-factures':   'nav-factures',
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
    if (['page-mes-echeances', 'page-mes-factures'].includes(pageId)) {
      setTimeout(() => Animations.animatePageCounters(pageId), 150);
    }
    if (pageId === 'page-contacter-flexla' && !this._contactInit) {
      this._contactInit = true;
      this._initContactForm();
    }
  },

  _initContactForm() {
    const formWrap   = document.getElementById('contact-form-wrap');
    const successWrap= document.getElementById('contact-success');
    const chips      = document.querySelectorAll('#theme-chips .chip');
    const bugFields  = document.getElementById('bug-fields');
    const textarea   = document.getElementById('contact-message');
    const sendBtn    = document.getElementById('btn-contact-send');
    const newBtn     = document.getElementById('btn-contact-new');
    let selectedTheme = null;
    let selectedLabel = null;

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
        selectedTheme = chip.dataset.theme;
        selectedLabel = chip.dataset.label;
        if (selectedTheme === 'bug') {
          bugFields.classList.remove('bug-fields-hidden');
          bugFields.classList.add('bug-fields-visible');
        } else {
          bugFields.classList.remove('bug-fields-visible');
          bugFields.classList.add('bug-fields-hidden');
        }
      });
    });

    sendBtn.addEventListener('click', () => {
      if (!selectedTheme) {
        chips.forEach(c => { c.classList.add('shake'); setTimeout(() => c.classList.remove('shake'), 300); });
        return;
      }
      const msg = textarea.value.trim();
      if (!msg) {
        textarea.style.borderColor = 'var(--err)';
        setTimeout(() => textarea.style.borderColor = '', 1200);
        return;
      }
      const pageField = document.getElementById('contact-page-field');
      const pageConcernee = pageField ? pageField.value.trim() : '';
      let body = msg;
      if (selectedTheme === 'bug' && pageConcernee) body += `\n\nPage concernée : ${pageConcernee}`;
      const subject = `[Espace chauffeur] ${selectedLabel}`;
      window.open(`mailto:charly.stadler11@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
      formWrap.style.display = 'none';
      successWrap.style.display = 'flex';
    });

    newBtn.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('selected'));
      bugFields.classList.remove('bug-fields-visible');
      bugFields.classList.add('bug-fields-hidden');
      textarea.value = '';
      const pageField = document.getElementById('contact-page-field');
      if (pageField) pageField.value = '';
      selectedTheme = null;
      selectedLabel = null;
      successWrap.style.display = 'none';
      formWrap.style.display = 'block';
    });
  },

  _fillDashboard() {
    const prenom = document.getElementById('dashboard-prenom');
    const date   = document.getElementById('dashboard-date');
    const avatar = document.getElementById('dashboard-avatar');
    if (prenom) prenom.textContent = Data.chauffeur.prenom;
    if (date)   date.textContent   = Data.date;
    if (avatar) avatar.textContent = Data.chauffeur.initiales;
  },

  init() {
    // Connexion submit — n'importe quoi fonctionne
    const form = document.getElementById('form-connexion');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this._fillDashboard();
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

document.addEventListener('DOMContentLoaded', () => {
  // Cacher la navbar dès le chargement
  document.querySelector('.navbar').style.display = 'none';
  Router.init();
});
