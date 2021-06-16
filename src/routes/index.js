const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("index"); //por la configuración que hicimos no es necesario pasar la ruta
});

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post(
  "/signup",
  passport.authenticate("local-signup", {
    successRedirect: "/profile", //Sí el registro funciona, a donde redirecciona
    failureRedirect: "/signup", //Sí el registro falla, a donde redirecciona
    passReqToCallback: true, //Para pasarle en el reques, todo los datos que tenemos del cliente
  })
);

router.get("/signin", (req, res, next) => {});

router.post("/signin", (req, res, next) => {});

router.get("/profile", (req, res, next) => {
  res.render("profiles");
});

module.exports = router;
