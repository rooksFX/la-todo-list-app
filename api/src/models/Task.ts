import mongoose from "mongoose";

const { Schema } = mongoose;

const taskSchema = new Schema({
    task:{
       type: String,
       required: true
    },
    email:{
       type: String,
       required: true
    },
    order: {
       type: Number,
       required: true
    },
    status:{
       type: String,
       required: true
    },
}, {
    timestamps: true,
    collection: 'tasks'
 });

export const TaskModel = mongoose.model('Task', taskSchema);