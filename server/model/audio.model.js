import mongoose from "mongoose";

const audioSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  sourceType: {
    type: String,
    enum: ["upload", "extracted", "shared"],
    default: "upload"
  },
  fileUrl: {   // link to audio file (S3, Cloudinary, local storage, etc.)
    type: String,
  },
  fileId: String,
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  commentCount: {
    type: Number,
    default: 0
  },
  shares: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  originalAudio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Audio'
  },
  collection: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Collection'
  },
  duration: Number,   // in seconds
  coverImageId: String,
  coverImage: String, // optional album art
  tags: [String],     // ex: ["lofi", "study", "remix"]
}, {timestamps: true,toJSON: {virtuals: true}, toObject: {virtuals: true}});

audioSchema.virtual('likeCount').get(function () { return this.likes?.length || 0})
audioSchema.virtual('shareCount').get(function () {return this.shares?.length || 0})

export const Audio = mongoose.model("Audio", audioSchema);
