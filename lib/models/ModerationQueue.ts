import mongoose, { Schema, model, models } from "mongoose";

const ContentSchema = new Schema({
    description: { type: String, required: true },
    url: { type: String },
    image: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, default: "pending" },
    createdAt: { type: Date, default: Date.now },
});

export const Content = models.Content || model("Content", ContentSchema);
