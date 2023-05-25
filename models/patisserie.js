const mongoose = require("mongoose");
require('dotenv').config();


const patisserieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
});

const Patisserie = mongoose.model("Patisserie", patisserieSchema);

// Connexion à la base de données MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Supprimer une pâtisserie du stock
const removePatisserieFromStock = async (patisserieName) => {
  try {
    const patisserie = await Patisserie.findOne({ name: patisserieName });
    if (patisserie) {
      patisserie.stock--;
      await patisserie.save();
      console.log(`Patisserie "${patisserieName}" enlevée du stock.`);
    } else {
      console.log(`Patisserie "${patisserieName}" non trouvée.`);
    }
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la suppression de la pâtisserie du stock :",
      error.message
    );
  }
};

// Création des documents de pâtisseries avec le stock initial
const createPatisserie = async (name, stock) => {
  try {
    const patisserie = new Patisserie({ name, stock });
    await patisserie.save();
    console.log(
      `Patisserie "${name}" créée avec un stock initial de ${stock}.`
    );
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la création de la pâtisserie :",
      error.message
    );
  }
};

// Création des pâtisseries avec les stocks initiaux
createPatisserie("Brioche sucrée avec chocolat", 15);
createPatisserie("Cake glacé fondant au chocolat", 35);
createPatisserie("Tarte aux fruits", 24);
createPatisserie("Éclair au café", 30);
createPatisserie("Croissant aux amandes", 25);

// Exemple d'utilisation pour enlever une pâtisserie du stock
const patisserieName = "Brioche sucrée avec chocolat";
removePatisserieFromStock(patisserieName);
module.exports = Patisserie;