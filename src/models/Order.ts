import mongoose from "mongoose";

const subOptionSchema = new mongoose.Schema({
  code: String,
  price: Number,
  imageUrl: String,
  details: String,
  name: String,
});

const optionSchema = new mongoose.Schema({
  name: String,
  price: Number,
  imageUrl: String,
  type: String,
  specification: String,
  pcs: Number,
  suboptions: [subOptionSchema],
});

const orderSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  productName: { type: String },
  options: [optionSchema],
  total: { type: Number },
  discount: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
  vendedorEmail: { type: String },
  vendedorName: { type: String },
  comentaries: { type: String, default: "" },
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
