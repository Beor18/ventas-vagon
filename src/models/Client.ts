import mongoose from "mongoose";
const { Schema } = mongoose;

const ClienteSchema = new Schema(
  {
    nombre: {
      type: String,
    },
    direccion_residencial: {
      type: String,
    },
    direccion_unidad: {
      type: String,
    },
    pin_localidad: {
      lat: {
        type: Number,
      },
      long: {
        type: Number,
      },
    },
    informacion_terreno: {
      fotos: [String],
      videos: [String],
    },
    propietario_terreno: {
      type: String,
    },
    proposito_unidad: {
      type: String,
    },
    estado_civil: {
      type: String,
      enum: ["Casado", "Soltero"],
    },
    lugar_empleo: {
      type: String,
    },
    email: {
      type: String,

      unique: true,
    },
    identificacion: {
      type: String,

      unique: true,
    },
    telefono: {
      type: String,
    },
    telefono_alterno: {
      type: String,
    },
    contrato_firmado: {
      type: String,
    },
    forma_pago: {
      type: String,
    },
    contacto_referencia: {
      type: String,
    },
    asegurador: {
      type: String,
    },
    seguro_comprado: {
      type: Boolean,
    },
    vendedor: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Client =
  mongoose.models.Client || mongoose.model("Client", ClienteSchema);

export default Client;
