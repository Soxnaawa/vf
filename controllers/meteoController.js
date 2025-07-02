const DonneeMeteo = require('../models/DonneeMeteo');

// Récupérer toutes les données météo ou filtrer par région
exports.getAllMeteo = async (req, res) => {
  try {
    const { region } = req.query;

    let filtre = {};
    if (region) {
      filtre.region = { $regex: new RegExp(region, 'i') }; // insensible à la casse
    }

    const donnees = await DonneeMeteo.find(filtre).sort({ date: -1 });
    res.render('meteo', { donnees, regionRecherchee: region || '' });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: "Erreur serveur" });
  }
};


