

import { object } from 'joi'
import {Schema , Types, model } from 'mongoose'

const userSchema = new Schema ({
    userName : {
        type : String , 
        required : true 
    },
     email:{
        type : String , 
        required : true ,
        unique : true
     },
     password :{
        type : String , 
        required : true 
     },
     age : String ,
    gender:{
        type : String , 
        enum : ['female','male'],
        default : 'female'
    },
    phone : String , 
    confirmEmail : {
        type : Boolean , 
        default : false 
    },
    isDeleted: {
        type: Boolean,
        default: false,
      },
      tasks: [{ type: Types.ObjectId, ref: 'Task' }] ,
      profileImage :{
type:object
      },
      coverImage :{
        type: [object]
      }
},{timestamps:true})


const userModel = model('User', userSchema)

export default userModel