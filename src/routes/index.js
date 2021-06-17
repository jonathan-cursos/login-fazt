const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post(
  "/signup",
  passport.authenticate("local-signup", {
    successRedirect: "/profile",
    failureRedirect: "/signup",
    passReqToCallback: true,
  })
);

router.get("/signin", (req, res, next) => {
  res.render("signin");
});

router.post(
  "/signin",
  passport.authenticate("local-signin", {
    successRedirect: "/profile",
    failureRedirect: "/signin",
    passReqToCallback: true,
  })
);

router.get("/logout", (req, res, next) => {
  req.logout(); //De passport
  res.redirect("/");
});

router.use((req, res, next) => {
  //Esta función sirve para que se ejecute como middleware
  //Solo para las rutas que están debajo
  //Para cuando tengamos muchas que queramos que usen el middleware isAuthenticated
  //Sí son pocas, lo hacemos una por una, pasando esta función como 2do parametro
  isAuthenticated(req, res, next);
  next();
});

router.get("/dash", (req, res, next) => {
  res.send("dashboard");
});

router.get("/profile", (req, res, next) => {
  res.render("profiles");
});

function isAuthenticated(req, res, next) {
  //middleware
  //En este middleware sí estamos autenticados nos deja continuar, de lo contrario nos redirecciona
  //Lo usamos sí queremos limitar el acceso
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/signin");
}

module.exports = router;
