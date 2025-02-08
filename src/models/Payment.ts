import mongoose from "mongoose";
const { Schema } = mongoose;

const paymentSchema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  clientId: { type: Schema.Types.ObjectId, ref: "Client", required: true },
  amount: { type: Number, required: true },
  receiptUrl: { type: String, required: true },
  invoiceUrl: { type: String }, // URL del PDF generado como factura
  paymentDate: { type: Date, default: Date.now },
  status: { type: String, enum: ["pending", "processed"], default: "pending" },
  createdBy: { type: String }, // Email del vendedor
  notes: { type: String },
});

export default mongoose.models.Payment ||
  mongoose.model("Payment", paymentSchema);
