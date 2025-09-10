import mongoose from "mongoose";

const ContentSchema = new mongoose.Schema({
    description: { type: String, required: true },
    url: { type: String },
    image: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, default: "pending" },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Content || mongoose.model("Content", ContentSchema);
