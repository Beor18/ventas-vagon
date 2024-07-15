import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
  name: String,
  price: Number,
  imageUrl: String,
  type: String,
  specification: String,
  pcs: Number,
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  quantity: { type: Number, required: true },
  material: { type: String, required: true },
  externalDimensions: { type: String, required: true },
  internalDimensions: { type: String, required: true },
  foldingState: { type: String, required: true },
  totalWeight: { type: Number, required: true },
  basePrice: { type: Number, required: true },
  options: [optionSchema],
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
