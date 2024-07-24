import {Schema , model ,Types} from 'mongoose'

const taskSchema = new Schema ({
    title:{
        type: String , 
        required: true,
    },
    description:{
        type: String , 
        required: true
    },
    userID :{
        type : Types.ObjectId,
        required:true,
        ref : 'User'
    },
    status:{
        type:String,
        enum:['toDo' ,' doing' , 'done'],
        default:'toDo'
    },
    assignTo:{
        type : Types.ObjectId,
        ref : 'User'
    },
    deadline:{
        type:Date,
        required:true 
    },
    attachments:[String]
   
},{timestamps:true})


const taskModel = model("Task", taskSchema)

export default taskModel