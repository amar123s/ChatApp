import mongoose from 'mongoose';


export const connectDB = async()=>{
 await mongoose.connect("mongodb://localhost:27017/chatApp")
 console.log("conntecd to DB using Mongoose")
}