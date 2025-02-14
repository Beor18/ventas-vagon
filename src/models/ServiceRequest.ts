import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const ServiceRequestSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },
    town: { type: String },
    problem: { type: String },
    installer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    assignedEquipment: { type: String },
    claimDate: { type: Date },
    assignmentDate: { type: Date },
    resolutionDate: { type: Date },
    images: [{ type: String }],
    comments: [CommentSchema],
    status: {
      type: String,
      enum: ["pending", "approved", "in_progress", "completed", "cancelled"],
      default: "pending",
    },
    type: {
      type: String,
      enum: ["delivery", "installation", "repair"],
    },
    warranty: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.ServiceRequest ||
  mongoose.model("ServiceRequest", ServiceRequestSchema);
