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
  colorName: { type: String },
  colorCode: { type: String },
  additionalPrice: { type: Number, default: 0 },
  imageUrl: { type: String },
});

// Nuevo esquema para diseños de casa
const houseDesignSchema = new mongoose.Schema({
  designType: { type: String },
  imageUrl: { type: String },
  cost: { type: Number },
});

// Nuevo esquema para floor plans
const floorPlanSchema = new mongoose.Schema({
  planName: { type: String },
  imageUrl: { type: String },
  cost: { type: Number },
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
  designs: [houseDesignSchema],
  floorPlans: [floorPlanSchema],
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
