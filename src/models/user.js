const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema } = mongoose;

const userSchema = new Schema({
  email: String,
  password: String,
});

userSchema.methods.encryptPassword = (password) => {
  //Le colocamos al metodo encryptPassword, pero puede ser cualquier nombre
  return bcrypt.hashSync(password, 10); //Para que no de warning, debemos usar los metodos asincronos
};

userSchema.methods.comparePassword = function (password) {
  //Lo hacemos con una función tipica, porque necesitamos usar this
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("user", userSchema);
