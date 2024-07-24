import joi from 'joi'
import { generalfields } from '../../utils/generalfields.js'

export const viewschema = joi.object({
_id :generalfields._id,
auth : generalfields.token

}).required()
export const signupSchema = joi.object({
    userName : joi.string().min(3).max(15).required(),
    email :generalfields.email,
    password : generalfields.password,
    cpassword : joi.string().valid(joi.ref('password')).required()
}).required()

export const loginSchema = joi.object({
    email : generalfields.email ,
    password : generalfields.password,
}).required()


export const updateschema = joi.object({
    userName : joi.string().min(3).max(15),
    age: joi.string().regex(/^\d{2}$/),
    gender: joi.string().valid('female','male')
    
    }).required()

export const changepassschema = joi.object({
    oldpass : generalfields.password,
    newpass : generalfields.password,
    cpass : joi.string().valid(joi.ref('newpass')).required()
}).required()

export const uploadprofileimage =joi.object({
    file:generalfields.file
    }).required()

export const uploadcoverimage =joi.object({
        files:generalfields.files
        }).required()