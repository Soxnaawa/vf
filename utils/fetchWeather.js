const axios = require('axios');
const mongoose = require('mongoose');
const DonneeMeteo = require('../models/DonneeMeteo');
const Alerte = require('../models/alerte');

const MONGO_URI = 'mongodb://localhost:27017/Appli-meteo';
const API_KEY = '8aed4be8084709781e1056eb5edde131';

const regions = [
  { nom: "Dakar", lat: 14.6928, lon: -17.4467 },
  { nom: "Thiès", lat: 14.7910, lon: -16.9256 },
  { nom: "Saint-Louis", lat: 16.0179, lon: -16.4896 },
  { nom: "Louga", lat: 15.6140, lon: -16.2500 },
  { nom: "Matam", lat: 15.6559, lon: -13.2557 },
  { nom: "Tambacounda", lat: 13.7699, lon: -13.6673 },
  { nom: "Kédougou", lat: 12.5585, lon: -12.1743 },
  { nom: "Kolda", lat: 12.8833, lon: -14.9500 },
  { nom: "Sédhiou", lat: 12.7042, lon: -15.5569 },
  { nom: "Ziguinchor", lat: 12.5833, lon: -16.2667 },
  { nom: "Fatick", lat: 14.3396, lon: -16.4160 },
  { nom: "Kaolack", lat: 14.1833, lon: -16.2500 },
  { nom: "Diourbel", lat: 14.6550, lon: -16.2300 }
];

async function fetchWeatherForRegion(region) {
  try {
    // Récupération des données météo actuelles
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
      params: {
        lat: region.lat,
        lon: region.lon,
        appid: API_KEY,
        units: 'metric',
        lang: 'fr'
      }
    });

    const data = response.data;
    const condition = data.weather[0].main.toLowerCase();
    const description = data.weather[0].description;

    // Prévisions sur 5 jours
    const forecastResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
      params: {
        lat: region.lat,
        lon: region.lon,
        appid: API_KEY,
        units: 'metric',
        lang: 'fr'
      }
    });

    const forecastData = forecastResponse.data.list;
    const dailyForecast = {};

    // Organiser les prévisions par jour
    forecastData.forEach(item => {
      const date = item.dt_txt.split(' ')[0]; // Récupérer uniquement la date (format YYYY-MM-DD)
      if (!dailyForecast[date]) {
        dailyForecast[date] = {
          pluie: 0,
          vent: 0,
          temperature: 0,
          count: 0
        };
      }

      // Somme des prévisions pour chaque jour
      dailyForecast[date].pluie += item.rain ? item.rain["3h"] : 0;
      dailyForecast[date].vent += item.wind.speed;
      dailyForecast[date].temperature += item.main.temp;
      dailyForecast[date].count++;
    });

    // Calculer les moyennes des prévisions
    for (const date in dailyForecast) {
      dailyForecast[date].temperature /= dailyForecast[date].count;
      dailyForecast[date].vent /= dailyForecast[date].count;
    }

    // Mise à jour des données météo actuelles dans la base de données
    await DonneeMeteo.findOneAndUpdate(
      { region: region.nom },
      {
        temperature: data.main.temp,
        humidite: data.main.humidity,
        pression: data.main.pressure,
        vent: {
          vitesse: data.wind.speed,
          direction: data.wind.deg
        },
        description,
        condition,
        date: new Date()
      },
      { upsert: true, new: true }
    );

    console.log(` Donnée météo mise à jour pour ${region.nom}`);

    //  Gérer dynamiquement les alertes météo avec prévisions sur plusieurs jours
    const typeAlerteSimpleMap = {
      rain: "Pluie",
      thunderstorm: "Orage",
      fog: "Brouillard",
      dust: "Vent de sable",
      sand: "Tempête de sable",
      heat: "Canicule",
      wind: "Vent fort",
      tornado: "Tornade"
    };

    // Vérification des alertes pour chaque jour
    for (const date in dailyForecast) {
      const tempData = dailyForecast[date];

      // Si la pluie, vent ou température dépasse un seuil, générer une alerte
      let niveau = "modere"; // par défaut

      if (tempData.pluie > 30) niveau = "eleve"; // forte pluie
      if (tempData.vent > 15) niveau = "eleve";  // vent fort
      if (tempData.temperature > 42) niveau = "eleve"; // chaleur extrême
      else if (tempData.temperature < 36) niveau = "faible"; // chaleur modérée

      const alerte = new Alerte({
        typeAlerte: "Pluie", // Exemple simple, mais cela pourrait être basé sur les conditions
        niveau: niveau,
        region: region.nom,
        description: `Prévisions pour ${date}: Pluie: ${tempData.pluie}mm, Vent: ${tempData.vent}m/s, Température: ${tempData.temperature}°C`,
        dateDebut: new Date(date),
        dateFin: new Date(new Date(date).setHours(23, 59, 59, 999)) // Alerte valable toute la journée
      });

      await alerte.save();
      console.log(` Alerte météo pour ${region.nom} le ${date}: ${niveau}`);
    }

  } catch (error) {
    console.error(`Erreur pour ${region.nom}:`, error.message);
  }
}

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log(" Connecté à MongoDB");

  for (const region of regions) {
    await fetchWeatherForRegion(region);
  }

  mongoose.disconnect();
}

main();
