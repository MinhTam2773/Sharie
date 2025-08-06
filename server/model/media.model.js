import mongoose from "mongoose"

export const MediaSchema = new mongoose.Schema({
  mediaUrl: { type: String, required: true },
  mediaType: { type: String, enum: ['image', 'video'], required: true }
}, { _id: false }) // optional: disable _id for subdocs
