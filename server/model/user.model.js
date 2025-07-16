import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: false
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    bio: {
        type: String,
        default: ""
    },
    avatar: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ["Male", "Female"],
        required: true
    },
    likedByPeople: {
        type: Number,
        required: true,
        default: 0
    },
    postCount: {
        type: Number,
        default: 0,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        required: true
    }
})

userSchema.pre('save', function (next) {
    if (!this.avatar) {
        if (this.gender === 'Male') {
            this.avatar = 'https://static.vecteezy.com/system/resources/thumbnails/001/840/612/small/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg'
        } else if (this.gender === 'Female') {
            this.avatar = 'https://cdn.vectorstock.com/i/1000v/14/18/default-female-avatar-profile-picture-icon-grey-vector-34511418.jpg'
        }
    }
    next()
})

const User = mongoose.model("User", userSchema)
export default User