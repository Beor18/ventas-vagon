import mongoose from "mongoose";

const { Schema } = mongoose;

const FinanciamientoSchema = new Schema(
  {
    nombre: {
      type: String,
    },
    direccion_postal: {
      type: String,
    },
    direccion_fisica: {
      type: String,
    },
    fecha_nacimiento: {
      type: Date,
    },
    telefono_contacto: {
      type: String,
    },
    costo_propiedad: {
      type: Number,
    },
    modelo_propiedad: {
      type: String,
    },
    uso_propiedad: {
      type: String,
    },
    vendedor: {
      type: String,
    },
    comentarios: {
      type: String,
    },
    documentos: {
      type: [String],
    },
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
  },
  { timestamps: true }
);

const Financiamiento =
  mongoose.models.Financiamiento ||
  mongoose.model("Financiamiento", FinanciamientoSchema);

export default Financiamiento;
