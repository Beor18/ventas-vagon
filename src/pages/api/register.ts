import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../lib/mongodb";
import { User } from "../../models/User";
import crypto from "crypto";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();

  if (req.method === "POST") {
    const { email, password, name, role } = req.body;

    // Verifica si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      role,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } else if (req.method === "GET") {
    // Obtiene todos los usuarios
    const users = await User.find({});
    res.status(200).json(users);
  } else if (req.method === "PUT") {
    const { email, name, role, password } = req.body;

    // Verifica si el usuario existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Actualiza los campos si se proporcionan
    if (name) user.name = name;
    if (role) user.role = role;
    if (password) {
      user.password = crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");
    }

    await user.save();

    res.status(200).json({ message: "User updated successfully" });
  } else if (req.method === "DELETE") {
    const { _id } = req.body;

    // Verifica si el usuario existe
    const user = await User.findOne({ _id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Elimina el usuario
    await User.deleteOne({ _id });

    res.status(200).json({ message: "User deleted successfully" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
