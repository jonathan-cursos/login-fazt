const express = require("express");
const engine = require("ejs-mate");
const path = require("path");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");

//Initializations
const app = express();
require("./database");
require("./passport/local-auth");

//settings
app.set("views", path.join(__dirname, "views")); //Cómo la estructura es diferente, le decimos a node donde estarán las vistas
app.engine("ejs", engine);
app.set("view engine", "ejs"); //Con esta línea y la anterior podemos usar ejs en nuestra app
app.set("port", process.env.PORT || 3000);

//middlewares: Funciones que se ejecutan antes de que las llamadas pasen a las rutas
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false })); //Necesario para cuando los datos vengan de un formulario. Extended false indica que no se va a enviar ningun dato pesado, como archivos
app.use(
  session({
    //Debemos iniciar esa sesión tambien en node, por eso usamos session
    //Aquí configuramos esa sesion
    secret: "mysecretsession",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash()); //Flash hace uso de session, entonces va despues, pero antes de passport
app.use(passport.initialize()); //Antes de inicializar passport y la sesion, debemos iniciar la session de node
app.use(passport.session());

app.use((req, res, next) => {
  //Middleware personalizado
  app.locals.signupMessage = req.flash("signupMessage"); //Mediante una variable, le pasamos a toda nuestra app el mensaje que esté en signupMessage
  next(); //Para que continue con el resto de procesos
});

//Routes
app.use("/", require("./routes/index"));

//starting server
app.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`);
});
