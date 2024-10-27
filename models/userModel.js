const mongoose = require("mongoose");
const Schemas = mongoose.Schema;
const bcrypt = require("bcryptjs");

const userSchema = new Schemas(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      default:"user"
    },
  },
  { timestamps: true }
);

userSchema.statics.authenticate = async function ( email, password) {
  const foundUser = await this.findOne({email});
  if (foundUser) {
    const isValid = await bcrypt.compare(password, foundUser.password);
    return isValid ? foundUser : false;
  }
  return false;
  //If isValid is true we return the foundUser otherwise we return false
};
//Middleware pour enregistrer l'utilisateur et has le mot de passe

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model("User", userSchema);
