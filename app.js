// app.js
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const expressLayouts = require('express-ejs-layouts'); // ✅ ajout
const indexRoutes = require('./routes/index');
const meteoRoutes = require('./routes/meteoRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Connecté à MongoDB"))
  .catch(err => console.error("Erreur MongoDB :", err));

  app.use(express.json());

// Configuration du moteur de template EJS avec layout
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout'); //  layout.ejs dans /views
app.use(expressLayouts); // middleware pour ejs-layouts

// Middleware static et body parser
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Routes

app.use('/', indexRoutes);
app.use('/meteo', meteoRoutes);
app.use('/api/users', userRoutes);
// Page 404
app.use((req, res) => {
  res.status(404).render('error', { message: "Page non trouvée" });
});

// Lancer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
})

;
