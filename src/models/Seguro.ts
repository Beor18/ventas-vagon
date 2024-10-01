import mongoose from "mongoose";

const { Schema } = mongoose;

const SeguroSchema = new Schema(
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
  },
  { timestamps: true }
);

const Seguro = mongoose.models.Seguro || mongoose.model("Seguro", SeguroSchema);

export default Seguro;
