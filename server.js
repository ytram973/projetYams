const express = require("express")
const mongoose = require("mongoose")
const Patisserie = require("./models/patisserie")
const User = require('./models/user');

const app = express()
const port = 3000 


mongoose
  .connect("mongodb://127.0.0.1:27017/jeu-yams", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB")
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error)
  })

// Configuration du moteur de rendu Pug
app.set("view engine", "pug")
app.set("views", "./views")

// // Middleware pour la gestion de session
// app.use(
//   session({
//     secret: "secret-key",
//     resave: false,
//     saveUninitialized: true,
//   })
// )

// // Middleware pour la gestion des données de formulaire
// const requireAuth = (req, res, next) => {
//   if (req.session.LoggedIn) {
//     next()
//   } else {
//     res.redirect("/login")
//   }
// }

// Routes de l'application
app.get("/", async (req, res) => {
  try {
    const patisseries = await Patisserie.find().sort({ order: 1 })
    res.render("index", { patisseries })
  } catch (error) {
    console.error("Error retrieving pastries:", error)
    res.sendStatus(500)
  }
})

app.use(express.static("assets"))

app.get("/", async (req, res) => {
  try {
    const patisseries = await Patisserie.find().sort({ order: 1 })
    const dice = [1, 2, 3, 4, 5] // Exemple de liste de valeurs pour les dés
    res.render("index", { patisseries, dice })
  } catch (error) {
    console.error("Error retrieving pastries:", error)
    res.sendStatus(500)
  }
})


app.get("/login", (req, res) => {
  res.render("login")
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });
    if (user) {
      // Utilisateur trouvé, connexion réussie
      res.status(200).json({ message: 'Login successful' });
    } else {
      // Utilisateur non trouvé, identifiants invalides
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.sendStatus(500);
  }
});




app.get("/Register", async (req, res) => {
  res.render("Register")
})
app.post('/Register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Création d'une nouvelle instance de User avec les données de l'utilisateur
    const newUser = new User({
      username: username,
      email: email,
      password: password
    });

    // Enregistrement du nouvel utilisateur dans la base de données
    await newUser.save();

    res.status(201).json({ message: 'Registration successful', user: newUser });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(409).json({ message: error.message });
  }
});


// Démarrer le serveur
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})
