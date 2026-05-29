const Data = {
  chauffeur: {
    prenom:    'Charly',
    nom:       'Stadler',
    initiales: 'CS',
  },
  vehicule: {
    modele: 'Model 3',
    statut: 'En ligne',
  },
  echeance: {
    date:            '3 juin 2026',
    montant:         312,
    kmActuels:       2187,
    kmForfait:       3000,
    prochaineService:'15 juil. 2026',
  },
  date: new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  }),
};
