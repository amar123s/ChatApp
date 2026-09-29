import mongoose from "mongoose";

export const mschema = new mongoose.Schema(
    {
        username: String,
        avatar:String,
        message: String,
        to:{type:String,default:null}, 
        timestamp: { type: Date, default: Date.now }
})
export const mesmodel = mongoose.model('message',mschema);
    