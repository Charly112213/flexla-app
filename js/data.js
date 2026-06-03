const Data = {
  chauffeur: {
    prenom:    'Charly',
    nom:       'Stadler',
    initiales: 'CS',
  },
  vehicule: {
    modele:    'Model 3',
    plaque:    'AB-123-CD',
    locataire: 'Jean Dupont',
    statut:    'En ligne',
  },
  echeance: {
    datePrelevement: '3 juin 2026',
    montantEstime:   312,
    kmActuels:       2187,
    kmForfait:       3000,
    prochaineService:'15 juil. 2026',
    derniere: {
      periodeDebut: '21/05/2026',
      periodeFin:   '28/05/2026',
      kmDebut:      159669,
      kmFin:        162239,
      kmEffectues:  2570,
      kmInclus:     700,
      ajustement:   1870,
      montantPaye:  187,
    },
    enCours: {
      periodeDebut:   '29/05/2026',
      kmDebut:        162239,
      kmActuels:      163144,
      kmEffectues:    905,
      kmInclus:       700,
      ajustement:     205,
      montantEstime:  20.5,
    },
  },
  ct: {
    lieu:         'Contrôle Auto Plus',
    adresse:      '12 avenue des Minimes, 31200 Toulouse',
    dateDernier:  '3 août 2024',
    dateProchain: '3 août 2026',
    statut:       'ok',
    kmDernier:    142000,
  },
  pneus: {
    etat:   'Bon état',
    avant:  { taille: '205/55 R16', dernierChangement: '145 200 km' },
    arriere:{ taille: '205/55 R16', dernierChangement: '145 200 km' },
  },
  suiviPhoto: [
    { date: '15 mai 2026',   nb: 6, label: 'Contrôle mensuel' },
    { date: '15 avr. 2026',  nb: 6, label: 'Contrôle mensuel' },
    { date: '15 mars 2026',  nb: 8, label: 'Prise en charge' },
  ],
  date: new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  }),
};
