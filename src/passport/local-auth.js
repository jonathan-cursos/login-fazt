const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy; //Los distintos metodos de autenticación de passport los llama Strategy
const User = require("../models/user");

//SERIALIZAR
passport.serializeUser((user, done) => {
  done(null, user.id); //De ese usuario, lo que estamos haciendo es serializar solo su id
});

//DESERIALIZAR
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id); //findById es un metodo de mongoose para buscar un elemento por medio del id
  done(null, user);
});

//REGISTRO
passport.use(
  "local-signup", //nombre cualquiera
  new LocalStrategy(
    {
      usernameField: "email", //Campo de username será el email, que es el name del input.
      passwordField: "password", //Igual que arriba
      passReqToCallback: true, //Esto es necesario porque en el callback siguiente, ademas de recibir el password y el user/email, podemos recibir la request, y con ella los demas datos que solicitamos para el registro, y así almacenarlo todo al mismo tiempo
    },
    async (req, email, password, done) => {
      //El parametro done es un callback que usamos para devolver una respuesta al cliente
      //En este espacio manipulamos los datos, mandamos a una DB por ejemplo
      const user = User.findOne({ email: email });
      if (user) {
        //validación para saber sí el correo ya existe
        return done(
          null,
          false,
          req.flash("signupMessage", "El email ya fue tomado")
        ); //gracias al middleware de flash, podemos usarlo desde la req. Con esto, no retornamos ni error, ni un usuario, sino que un mensaje, que diga que el email fue tomado
      } else {
        const newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        await newUser.save();
        done(null, newUser); //El 1er parametro tendrá el error, el segundo, la info del usuario guardado
      }
    }
  )
); //La instancia recibe un objeto con los datos que recibiremos, y un callback donde indicamos que vamos a hacer con esos datos

/*
Una vez el usuario se haya registrado, los datos de este vamos a guardarlos internamente en un archivo del navegador.
La razón, es que cada vez que el usuario visite una página, no lo vamos a autenticar por cada página que visite.
Sino, guardaremos esos datos de autenticado en el navegador, y se los pasaremos a las distintas páginas.
Para hacer esto, passport utiliza 2 metodos, serializar y deserializar
Estos 2 serán los que estarán arriba del metodo de registro.
Para entenderlo más facilmente: Cada vez que el usuario se autentique a traves de este metodo de registro, guardaremos en el navegador el ID por medio del serialize,
  cada vez que accedamos una página el ID estará guardado ahí gracias a este serialize, pero para saber que el id existe dentro de la DB, cada vez que visitemos esa página,
  debemos hacer esa validación, eso lo hara deserialize.
*/
