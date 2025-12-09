import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  audios: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Audio"
    }
  ],
  coverImage: String,
});

export const Collection = mongoose.model("Collection", collectionSchema);
