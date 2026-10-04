import mongoose from 'mongoose';

export const connectDB = async()=>{
    try{
 await mongoose.connect(process.env.MONGO_URL)
 console.log("connected to DB using Mongoose")
 }catch(err){
    console.error("DB connection failed:",err.message);
    process.exit(1);
 }

}