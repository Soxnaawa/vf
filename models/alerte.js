const mongoose = require("mongoose");

const AlerteSchema = new mongoose.Schema({
  typeAlerte: { 
    type: String,
    required: true,
    enum: [
      "Pluie",
      "Vent",
      "Canicule",
      "Inondation"
    ]
  },
  niveau: {
    type: String,
    required: true,
    enum: ["faible", "modere", "eleve", "extreme"]
  },
  region: {
    type: String,
    required: true,
  },
  dateDebut: {
    type: Date,
    required: true
  },
  dateFin: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    default: ""
  }
}, { timestamps: true });

module.exports = mongoose.model('Alerte', AlerteSchema);
