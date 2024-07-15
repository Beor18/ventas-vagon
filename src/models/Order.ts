import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
  name: String,
  price: Number,
  imageUrl: String,
  type: String,
  specification: String,
  pcs: Number,
});

const orderSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  productName: { type: String, required: true },
  options: [optionSchema],
  total: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
