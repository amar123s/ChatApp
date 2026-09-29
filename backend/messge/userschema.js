import mongoose from "mongoose";
export const uschema=new mongoose.Schema({
    username:{type:String,require:true,unique:false,trim:true},
    password:{type:String,required:true},
    avatar:{type:String,default:""}
});

export const usermodel=mongoose.model("user",uschema)