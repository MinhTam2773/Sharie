import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()
export const connectDB = async () => {
    try{
        const connect = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB connected at: ${connect.connection.host}`)
    } catch(err){
        console.error(`Error: ${err.message}`)
        process.exit(1)
    }
}