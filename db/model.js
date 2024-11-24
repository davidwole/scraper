import mongoose from "mongoose";

const ProcessedLinkSchema = new mongoose.Schema({
  link: { type: String, unique: true },
});

export const ProcessedLink = mongoose.model(
  "ProcessedLink",
  ProcessedLinkSchema
);
