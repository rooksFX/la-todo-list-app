import mongoose from "mongoose";

const { Schema } = mongoose;

let userSchema = new Schema({
    name:{
       type: String,
       required: true
    },
    email: {
       type: String,
       required: true
    },
    password: {
       type: String,
       required: true
    }
 },{
    timestamps: true,
    collection: 'users'
 })

export const UserModel = mongoose.model('User', userSchema);
