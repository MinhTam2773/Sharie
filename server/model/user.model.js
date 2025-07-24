import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    uid: {
        type: String,
    },
    username: {
        type: String,
        unique: true,
        required: true,
        minlength: [1, "Name must contain at least 1 letter"],
        trim: true,
        validate: {
            validator: (value) => !/\s/.test(value),
            message: "Username must not contain spaces"
        }

    },
    password:{
        type: String, 
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate: {
            validator: function (value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); // basic email regex
            },
            message: (props) => `${props.value} is not a valid email address`
        }
    },
    bio: {
        type: String,
        default: ""
    },
    avatar: {
        type: String,
        default: 'https://static.vecteezy.com/system/resources/thumbnails/001/840/612/small/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg'
    },
    following: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    followers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    postCount: {
        type: Number,
        default: 0,
        required: true
    },
    refreshToken: {
        type: String,
    }
}, {timestamps: true})

const User = mongoose.model("User", userSchema)

export default User