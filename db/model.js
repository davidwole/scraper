import mongoose from "mongoose";

const ProcessedLinkSchema = new mongoose.Schema({
  title: { type: String },
  link: { type: String, unique: true },
});

export const ProcessedLink = mongoose.model(
  "ProcessedLink",
  ProcessedLinkSchema
);
