import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'

const generateAccessToken = (user) => {
    return jwt.sign({id: user._id}, process.env.ACCESS_TOKEN_KEY, {expiresIn: "15m"})
}
const generateRefreshToken = (user) => {
    return jwt.sign({id: user._id}, process.env.REFRESH_TOKEN_KEY, {expiresIn: "7d"})
}

export const signin =  async (req, res) => {
    try {
        const {username, email, password, gender} = req.body

        if (!username || !email || !password || !gender) {
            return res.status(400).json({success: false, message: "Please fill all fields"})
        }
        else if(await User.findOne({email})) {
            return res.status(401).json({success: false, message: "User already exist"})
        } else if (await User.findOne({username})) {
            return res.status(402).json({success: false, message:'Username is already taken'})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({username, email, password: hashedPassword, gender})

        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            path: '/',
            sameSite: 'strict',
        })
        user.refreshToken = refreshToken
        await user.save()

        res.status(200).json({success:true, accessToken, message: 'Sign in successfully'})
    } catch(err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map((e) => e.message)
            return res.status(403).json({messages})
        }
        res.status(404).json({success: false, message:"Sign in false"})
    }
}

export const login = async (req, res) => {
    try{
        const {email, password} = req.body
        const user = await User.findOne({email})
        if (!email || !password) {
            return res.status(400).json({success: false, message: 'Please fill all fields'})
        } else if (!user) {
            return res.status(401).json({success: false, message: 'Email not found'})
        } else if (!(await bcrypt.compare(password, user.password))) { 
            return res.status(402).json({success: false, message:'password is wrong'})
        }

        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            path: '/',
            sameSite:'strict'
        })

        user.refreshToken = refreshToken
        await user.save()
        res.status(200).json({success: true, accessToken, message:'Login successfully'})
    } catch(err) {
        res.status(400).json({error: err.message})
    }
}

export const generateNewAccessToken = async (req, res) => {
    try{
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
            return res.status(400).json({success: false, message:"no refreshToken in cookie"})
        }

        //verify refresh token to get id inside
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY) //get object stored in cookie
        const user = await User.findById(decoded.id)

        if (!user) {
            return res.status(401).json({success: false, message: "no user exists with id stored inside cookie"})
        } else if (user.refreshToken !== refreshToken) {
            return res.status(402).json({success: false, message:"Different refresh tokens"})
        }

        const accessToken = generateAccessToken(user)
        res.status(200).json({success: true, accessToken, message:"refresh token successfully"})
    } catch(err) {
        res.status(401).json({success: false, error: err.message})
    }
}

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
            return res.status(200).json({success: true, message: 'No token detected, already log out?'})
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY)
        const user = await User.findById(decoded.id)
        if (!user) {
            return res.status(401).json({success: false, message: "no user exists with id stored inside cookie"})
        }

        user.refreshToken = null
        await user.save()
        
        res.clearCookie('refreshToken', {path: '/'})
        res.status(201).json({success: true, message: 'log out successfully'})
    } catch(err) {
        return res.status(402).json({success: false, message: err.message})
    }
}