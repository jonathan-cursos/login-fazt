const express = require("express");
const engine = require("ejs-mate");
const path = require("path");
const app = express();

//settings
app.set("views", path.join(__dirname, "views")); //Cómo la estructura es diferente, le decimos a node donde estarán las vistas
app.engine("ejs", engine);
app.set("view engine", "ejs"); //Con esta línea y la anterior podemos usar ejs en nuestra app
app.set("port", process.env.PORT || 3000);

//starting server
app.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`);
});
