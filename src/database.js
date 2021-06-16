const mongoose = require("mongoose");
const { mongodb } = require("./keys");
mongoose
  .connect(mongodb.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((db) => console.log("DB connected"))
  .catch((err) => console.error("DB ERR: " + err));
