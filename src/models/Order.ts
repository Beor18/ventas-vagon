import mongoose from "mongoose";
import Client from "./Client";
const { Schema } = mongoose;

const subOptionSchema = new Schema({
  code: String,
  price: Number,
  imageUrl: String,
  details: String,
  name: String,
});

const optionSchema = new Schema({
  name: String,
  price: Number,
  imageUrl: String,
  type: String,
  specification: String,
  pcs: Number,
  suboptions: [subOptionSchema],
});

const colorOptionSchema = new mongoose.Schema({
  colorName: { type: String },
  colorCode: { type: String },
  additionalPrice: { type: Number, default: 0 },
  imageUrl: { type: String },
});

const houseDesignSchema = new mongoose.Schema({
  designType: { type: String },
  imageUrl: { type: String },
  cost: { type: Number },
});

const orderSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product" },
  productName: { type: String },
  options: [optionSchema],
  colorOptions: [colorOptionSchema],
  designs: [houseDesignSchema],
  total: { type: Number },
  discount: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
  vendedorEmail: { type: String },
  vendedorName: { type: String },
  fabricanteEmail: { type: String },
  fabricanteName: { type: String },
  comentaries: { type: String, default: "" },
  cliente: { type: Schema.Types.ObjectId, ref: "Client" },
  signatureImage: { type: String },
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
