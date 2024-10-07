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

const colorOptionSchema = new mongoose.Schema({
  colorName: { type: String, required: true },
  colorCode: { type: String, required: true },
  additionalPrice: { type: Number, default: 0 },
  imageUrl: { type: String },
});

const productSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  imageUrl: { type: String },
  quantity: { type: Number },
  material: { type: String },
  externalDimensions: { type: String },
  internalDimensions: { type: String },
  foldingState: { type: String },
  totalWeight: { type: Number },
  basePrice: { type: Number },
  options: [optionSchema],
  colorOptions: [colorOptionSchema],
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
