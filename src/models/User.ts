import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["Administrador", "Vendedor", "Instalador", "Fabricante"],
    default: "Vendedor",
  },
  phone: String,
  active: {
    type: Boolean,
    default: true,
  },
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
