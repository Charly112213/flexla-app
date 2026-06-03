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
      'page-dashboard':           'nav-accueil',
      'page-mon-compte':          'nav-compte',
      'page-mon-contrat':         'nav-contrat',
      'page-mes-echeances':       'nav-echeances',
      'page-suivi-vehicule':      'nav-entretiens',
      'page-pneumatiques':        'nav-entretiens',
      'page-pneus-form':          'nav-entretiens',
      'page-controle-technique':  'nav-entretiens',
      'page-suivi-photo':         'nav-entretiens',
      'page-sinistre':            null,
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
    if (['page-mes-echeances', 'page-mes-factures', 'page-pneumatiques'].includes(pageId)) {
      setTimeout(() => Animations.animatePageCounters(pageId), 150);
    }
    if (pageId === 'page-pneus-form' && !this._pneusInit) {
      this._pneusInit = true;
      this._initPneusForm();
    }
    if (pageId === 'page-contacter-flexla' && !this._contactInit) {
      this._contactInit = true;
      this._initContactForm();
    }
    if (pageId === 'page-sinistre' && !this._sinistreInit) {
      this._sinistreInit = true;
      this._initSinistreForm();
    }
    if (pageId === 'page-controle-technique') this._fillCT();
    if (pageId === 'page-suivi-photo')        this._fillSuiviPhoto();
    if (pageId === 'page-pneumatiques')       this._fillPneumatiques();
    if (pageId === 'page-mes-echeances')      this._fillEcheances();
  },

  _initPneusForm() {
    // Photos
    document.querySelectorAll('#page-pneus-form .photo-input').forEach(input => {
      input.addEventListener('change', () => {
        if (!input.files || !input.files[0]) return;
        const zone = input.closest('.photo-zone');
        const preview = zone.querySelector('.photo-preview');
        const reader = new FileReader();
        reader.onload = e => { preview.src = e.target.result; zone.classList.add('has-photo'); };
        reader.readAsDataURL(input.files[0]);
      });
    });

    // Signature canvas
    const canvas = document.getElementById('signature-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth   = 1.5;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
    let drawing = false;
    const pos = (e) => { const r = canvas.getBoundingClientRect(); const t = e.touches ? e.touches[0] : e; return { x: t.clientX - r.left, y: t.clientY - r.top }; };
    canvas.addEventListener('mousedown',  e => { drawing = true; const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); });
    canvas.addEventListener('mousemove',  e => { if (!drawing) return; const p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); });
    canvas.addEventListener('mouseup',    () => drawing = false);
    canvas.addEventListener('touchstart', e => { e.preventDefault(); drawing = true; const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); }, { passive: false });
    canvas.addEventListener('touchmove',  e => { e.preventDefault(); if (!drawing) return; const p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); }, { passive: false });
    canvas.addEventListener('touchend',   () => drawing = false);
    document.getElementById('btn-clear-sig').addEventListener('click', () => ctx.clearRect(0, 0, canvas.width, canvas.height));

    // Submit
    document.getElementById('btn-pneus-submit').addEventListener('click', () => {
      document.getElementById('pneus-form-wrap').style.display = 'none';
      document.getElementById('pneus-success').style.display   = 'flex';
    });
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

  _initSinistreForm() {
    const btn = document.getElementById('btn-fiche-assistance');
    if (btn) btn.addEventListener('click', () => window.open('https://drive.google.com/file/d/15m0uY6Z422IRK1xOTe_fpmrfm6-IxxMt/view', '_blank'));

    document.querySelectorAll('#page-sinistre .photo-input').forEach(input => {
      input.addEventListener('change', () => {
        if (!input.files || !input.files[0]) return;
        const zone = input.closest('.photo-zone');
        const preview = zone.querySelector('.photo-preview');
        const reader = new FileReader();
        reader.onload = e => { preview.src = e.target.result; zone.classList.add('has-photo'); };
        reader.readAsDataURL(input.files[0]);
      });
    });

    const submitBtn = document.getElementById('btn-sinistre-submit');
    if (submitBtn) submitBtn.addEventListener('click', () => {
      const desc = document.getElementById('sinistre-description');
      if (!desc || !desc.value.trim()) {
        if (desc) { desc.style.borderColor = 'var(--err)'; setTimeout(() => desc.style.borderColor = '', 1200); }
        return;
      }
      document.getElementById('sinistre-form-wrap').style.display = 'none';
      document.getElementById('sinistre-success').style.display   = 'flex';
    });
  },

  _fillDashboard() {
    const sel = id => document.getElementById(id);
    if (sel('dashboard-prenom')) sel('dashboard-prenom').textContent = Data.chauffeur.prenom;
    if (sel('dashboard-date'))   sel('dashboard-date').textContent   = Data.date;
    if (sel('dashboard-avatar')) sel('dashboard-avatar').textContent = Data.chauffeur.initiales;
    const e = Data.echeance;
    if (sel('banner-date'))       sel('banner-date').textContent      = e.datePrelevement;
    if (sel('banner-km'))         sel('banner-km').textContent        = `${e.kmActuels.toLocaleString('fr-FR')} km / ${e.kmForfait.toLocaleString('fr-FR')} km`;
    if (sel('banner-service'))    sel('banner-service').textContent   = `Prochain service — ${e.prochaineService}`;
    if (sel('banner-amount-val')) sel('banner-amount-val').textContent= `${e.montantEstime} €`;
    const teslaModel = document.querySelector('.tesla-model');
    if (teslaModel) teslaModel.textContent = Data.vehicule.modele;
    const teslaCar = document.querySelector('.tesla-car');
    if (teslaCar) teslaCar.src = Data.vehicule.imageUrl;
  },

  _fillEcheances() {
    const sel = id => document.getElementById(id);
    const e = Data.echeance;
    const d = e.derniere;
    const c = e.enCours;

    if (sel('ech-prel-date')) sel('ech-prel-date').textContent = e.datePrelevement;
    const montantEl = sel('ech-prel-montant');
    if (montantEl) {
      montantEl.dataset.count = e.montantEstime;
      montantEl.textContent = e.montantEstime.toLocaleString('fr-FR') + ' €';
    }

    const lastCard = sel('ech-last-card');
    if (lastCard) {
      lastCard.innerHTML = `
        <div class="periode-row">
          <span class="periode-date">${d.periodeDebut}</span>
          <div class="periode-sep"></div>
          <span class="periode-date">${d.periodeFin}</span>
        </div>
        <div class="data-grid">
          <div><div class="data-item-label">Km de départ</div><div class="data-item-val" data-count="${d.kmDebut}" data-suffix=" km">${d.kmDebut.toLocaleString('fr-FR')} km</div></div>
          <div><div class="data-item-label">Km d'arrivée</div><div class="data-item-val" data-count="${d.kmFin}" data-suffix=" km">${d.kmFin.toLocaleString('fr-FR')} km</div></div>
        </div>
        <div class="divider"></div>
        <div class="data-grid">
          <div><div class="data-item-label">Km effectués</div><div class="data-item-val" data-count="${d.kmEffectues}" data-suffix=" km">${d.kmEffectues.toLocaleString('fr-FR')} km</div></div>
          <div><div class="data-item-label">Km inclus</div><div class="data-item-val" data-count="${d.kmInclus}" data-suffix=" km">${d.kmInclus.toLocaleString('fr-FR')} km</div></div>
        </div>
        <div class="divider"></div>
        <div class="data-grid">
          <div><div class="data-item-label">Ajustement</div><div class="data-item-val ${d.ajustement > 0 ? 'orange' : ''}" data-count="${d.ajustement}" data-suffix=" km">${d.ajustement.toLocaleString('fr-FR')} km</div></div>
          <div><div class="data-item-label">Montant payé</div><div class="data-item-val accent" data-count="${d.montantPaye}" data-suffix=",00 €">${d.montantPaye.toLocaleString('fr-FR')},00 €</div></div>
        </div>`;
    }

    const curCard = sel('ech-cur-card');
    if (curCard) {
      const depasse = c.kmEffectues > c.kmInclus;
      const pct = depasse
        ? +(c.kmInclus / c.kmEffectues * 100).toFixed(1)
        : +(c.kmEffectues / c.kmInclus * 100).toFixed(1);
      const progressBg = depasse
        ? `linear-gradient(to right,#4CAF50 ${pct}%,#FF9800 ${pct}%)`
        : `linear-gradient(to right,#4CAF50 ${pct}%,#2A2A2A ${pct}%)`;
      const statusClass = depasse ? 'warn' : 'ok';
      const statusText = depasse
        ? `Dépassement de ${(c.kmEffectues - c.kmInclus).toLocaleString('fr-FR')} km — ~${c.montantEstime.toFixed(2).replace('.', ',')} € estimé`
        : `Dans le forfait — ${(c.kmInclus - c.kmEffectues).toLocaleString('fr-FR')} km restants`;

      curCard.innerHTML = `
        <div class="periode-row">
          <span class="periode-date">${c.periodeDebut}</span>
          <div class="periode-sep"></div>
          <span class="periode-date">Aujourd'hui</span>
        </div>
        <div class="data-grid">
          <div><div class="data-item-label">Km de départ</div><div class="data-item-val" data-count="${c.kmDebut}" data-suffix=" km">${c.kmDebut.toLocaleString('fr-FR')} km</div></div>
          <div><div class="data-item-label">Km actuels</div><div class="data-item-val" data-count="${c.kmActuels}" data-suffix=" km">${c.kmActuels.toLocaleString('fr-FR')} km</div></div>
        </div>
        <div class="progress-section">
          <div class="progress-header">
            <span class="progress-km" data-count="${c.kmEffectues}" data-suffix=" km effectués">${c.kmEffectues.toLocaleString('fr-FR')} km effectués</span>
            <span class="progress-limit">Forfait ${c.kmInclus.toLocaleString('fr-FR')} km</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width:100%;background:${progressBg}"></div>
            ${depasse ? `<div class="progress-marker" style="left:calc(${pct}% - 1px)"></div>` : ''}
          </div>
        </div>
        <div class="status-row">
          <div class="status-dot ${statusClass}"></div>
          <span class="status-text ${statusClass}">${statusText}</span>
        </div>`;
    }
  },

  _fillPneumatiques() {
    const sel = id => document.getElementById(id);
    const p = Data.pneus;
    const km = Data.echeance.enCours.kmActuels;
    if (sel('pneu-km-actuels'))   { sel('pneu-km-actuels').dataset.count = km; sel('pneu-km-actuels').textContent = km.toLocaleString('fr-FR') + ' km'; }
    if (sel('pneu-taille-avant'))   sel('pneu-taille-avant').textContent   = p.avant.taille;
    if (sel('pneu-taille-arriere')) sel('pneu-taille-arriere').textContent = p.arriere.taille;
    if (sel('pneu-chgt-avant'))     sel('pneu-chgt-avant').textContent     = p.avant.dernierChangement;
    if (sel('pneu-chgt-arriere'))   sel('pneu-chgt-arriere').textContent   = p.arriere.dernierChangement;
  },

  _fillCT() {
    const sel = id => document.getElementById(id);
    const ct = Data.ct;
    if (sel('ct-lieu'))         sel('ct-lieu').textContent         = ct.lieu;
    if (sel('ct-adresse'))      sel('ct-adresse').textContent      = ct.adresse;
    if (sel('ct-date-prochain'))sel('ct-date-prochain').textContent= ct.dateProchain;
    if (sel('ct-date-dernier')) sel('ct-date-dernier').textContent = ct.dateDernier;
    if (sel('ct-km-dernier'))   sel('ct-km-dernier').textContent   = ct.kmDernier.toLocaleString('fr-FR') + ' km';
    if (sel('sv-ct-sub'))       sel('sv-ct-sub').textContent       = `Prochain : ${ct.dateProchain}`;
    const dot = sel('ct-statut-dot');
    if (dot) { dot.className = `status-dot ${ct.statut}`; }
    const jours = sel('ct-jours');
    if (jours) {
      const couleur = ct.statut === 'ok' ? 'var(--ok)' : ct.statut === 'warn' ? 'var(--warn)' : 'var(--err)';
      jours.style.color = couleur;
    }
  },

  _fillSuiviPhoto() {
    const list = document.getElementById('suivi-photo-list');
    if (!list) return;
    list.innerHTML = Data.suiviPhoto.map(s => `
      <div class="item-card">
        <div class="item-left">
          <div class="item-info">
            <div class="item-title">${s.label}</div>
            <div class="item-sub">${s.nb} photos · ${s.date}</div>
          </div>
        </div>
        <div class="item-right"><div class="chevron"></div></div>
      </div>`).join('');
  },

  init() {
    const form = document.getElementById('form-connexion');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailEl = form.querySelector('input[type="text"]');
        const passEl  = form.querySelector('input[type="password"]');
        const email   = emailEl.value.trim().toLowerCase();
        const pass    = passEl.value;
        const account = ACCOUNTS[email];
        const errEl   = document.getElementById('login-error');

        if (!account || account.password !== pass) {
          passEl.style.borderColor = 'var(--err)';
          if (errEl) errEl.style.display = 'block';
          setTimeout(() => { passEl.style.borderColor = ''; }, 1500);
          return;
        }

        if (errEl) errEl.style.display = 'none';
        Data = account;
        Data.date = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
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

    // Dashboard cards + item-cards + buttons avec data-page
    document.querySelectorAll('.card[data-page], .item-card[data-page], button[data-page]').forEach(el => {
      el.addEventListener('click', () => this.navigate(el.dataset.page));
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
