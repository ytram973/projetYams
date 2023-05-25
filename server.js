require('dotenv').config(); 
const express = require("express");
const mongoose = require("mongoose");
const Patisserie = require("./models/patisserie");
const User = require('./models/user');
const session = require('express-session');

const app = express();
const port = process.env.PORT ;

mongoose
  .connect(process.env.MONGODB_URI, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.set("view engine", "pug");
app.set("views", "./views");

app.use(session({
  secret: process.env.SESSION_SECRET, // 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // true if you want to use it over HTTPS
}));

app.use(express.static("assets"));
app.use(express.static("./public"))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", isLoggedIn, async (req, res) => {
  try {
    const patisseries = await Patisserie.find().sort({ order: 1 });
    const dice = [1, 2, 3, 4, 5];
    const user = req.session.user; // Récupérer l'utilisateur connecté depuis la session
    res.render("index", { patisseries, dice, user }); // Passer la variable user
  } catch (error) {
    console.error("Error retrieving pastries:", error);
    res.sendStatus(500);
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });
    if (user) {
      req.session.user = user; // Setting the user in the session
      // res.status(200).json({ message: 'Login successful' });
      res.redirect("/")
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.sendStatus(500);
  }
});

app.get("/register", async (req, res) => {
  res.render("register");
});

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(409).json({ message: 'Username already exists.' });
    } else {
      const newUser = new User({
        username: username,
        email: email,
        password: password
      });

      await newUser.save();

      res.redirect('/login'); // Redirecting to login page after successful registration
    }
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(409).json({ message: error.message });
  }
});

app.get("/logout", function (req, res) {
  req.session.destroy(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

function isLoggedIn(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect("/login");
}

app.get("/play", isLoggedIn, (req, res) => {
  res.render("play");
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
