const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

//SERIALIZAR
passport.serializeUser((user, done) => {
  done(null, user.id);
});

//DESERIALIZAR
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

//REGISTRO
passport.use(
  "local-signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const user = await User.findOne({ email: email });
      if (user) {
        return done(
          null,
          false,
          req.flash("signupMessage", "El email ya fue tomado")
        );
      } else {
        const newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        await newUser.save();
        done(null, newUser);
      }
    }
  )
);

//LOGIN
passport.use(
  "local-signin",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const user = await User.findOne({ email: email });
      if (!user) {
        //Sí el usuario no existe
        return done(null, false, req.flash("signinMessage", "No user found"));
      }
      if (!user.comparePassword(password)) {
        //Sí el password no coincide
        return done(
          null,
          false,
          req.flash("signinMessage", "Incorrect password")
        );
      }
      done(null, user); //Sí todo va bien, devolvemos el usuario
      //Finalmente, login utiliza automaticamente serialize y deserialize
    }
  )
);
