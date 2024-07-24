import userModel from '../../../DB/models/User.model.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import sendEmail from '../../../utils/email.js'
import fs from 'fs'
import path from "path"
import auth from '../../../midelware/auth.js'
import cloudinary from '../../../utils/cloudinary.js'

//profile
export const profile = async(req,res ,next)=>{
const user = await userModel.findById({_id : req.user._id}).populate([{
    path : 'tasks'
}])
    return res.json({message:"done",user})
    }
// 1-signUp 

export const signUp = async (req,res,next)=>{
    const{userName,email,password} = req.body
    const userExist = await userModel.findOne({email})
    if(userExist){
        return next(new Error ('user exist',{cause : 409}))
       
    }
    const hashedpassword = bcrypt.hashSync(password,+process.env.ROUNDS)
    const sign = await userModel.create({userName,email,password:hashedpassword})
    const token = jwt.sign({_id:sign._id,email},process.env.AUTHSIGNETURE,{expiresIn:60*5})
    const link =` ${req.protocol}://${req.headers.host}/user/confirmEmail/${token}`
    const token2 = jwt.sign({_id:sign._id,email},process.env.AUTHSIGNETURE,{expiresIn:60*60*24})
    const link2 =` ${req.protocol}://${req.headers.host}/user/unsubscribe/${token2}`
    sendEmail({to: 'yaso.yasser055@gmail.com' ,subject : 'confirmemail', html :` <a href = '${link}'>
        confirmEmail
    </a>
    <br>
    <br>
    <a href = '${link2}'>
        unsubscribe
    </a>`})
    return sign? res.status(200).json({message:"user added",sign}): next(new Error ('invalid'))
}

//2-login-->with create token
export const login = async(req,res,next)=>{
const {email,password} = req.body
const exist = await userModel.findOne({email})
if (!exist){
    return next(new Error ('wrong email or password',{cause:401}))
}
// if(!exist.confirmEmail){
//     return next(new Error ('please confirm email first',{cause:400}))
// }
const compare = bcrypt.compareSync(password,exist.password)
if (!compare){
    return next(new Error ('wrong email or password',{cause:401}))
}
const token = jwt.sign({_id:exist._id,email},process.env.AUTHSIGNETURE,{expiresIn:60*60})
return res.status(200).json({message:"loginned successfully",token})
}
//3-change password (user must be logged in)
export const changepassword =async (req,res,next)=>{
    const{oldpass,newpass} = req.body
    const{_id} = req.user
    const user = await userModel.findById({_id})
    if(!user){
        return next(new Error("user not found",{cause:404}))
    }
    const match = bcrypt.compareSync(oldpass,user.password)
    if(!match){
        return next(new Error("wrong password",{cause:401}))
    }
    const hash = bcrypt.hashSync(newpass, +process.env.HASH_ROUND)
    user.password = hash 
    await user.save()
    return res.status(200).json({message:"done",user})
    }
//4-update user (age , userName)(user must be logged in)
export const updateuser = async(req,res,next)=>{
const  {userName , age ,gender} = req.body 
const {_id} = req.user
//const {_id} = req.params
const exist = await userModel.findByIdAndUpdate({_id},{userName , age ,gender},{ new: true})
if(!exist){
    return next(new Error ('user not exist',{cause:404}))
}
return res.status(200).json({message:'user updated succesfully'})
}
//5-delete user(user must be logged in)
export const deleteuser = async(req,res,next)=>{
    const {_id} = req.user
   // const {_id} = req.params 
    const exist = await userModel.findById({_id})
    if(!exist){
        return next(new Error ('user not exist',{cause:404}))
    }
    if (exist.coverImage && exist.coverImage.length > 0) {
        for (const coverImage of exist.coverImage) {
            if (fs.existsSync(path.resolve(`src/${coverImage}`))) {
                fs.unlinkSync(path.resolve(`src/${coverImage}`));
            }
        }
    }

    if (exist.profileImage && fs.existsSync(path.resolve(`src/${exist.profileImage}`))) {
        fs.unlinkSync(path.resolve(`src/${exist.profileImage}`));
    }
    const deleteuser = await userModel.findByIdAndDelete({_id})

    return res.status(200).json({ message: 'User deleted successfully' });
}
//6-soft delete(user must be logged in)
export const softdelete = async(req,res,next)=>{
    const {_id} = req.user
    //const {_id} = req.params 
    const exist = await userModel.findByIdAndUpdate({_id},{isDeleted :true},{ new: true })
    if(!exist){
        return next(new Error ('user not exist',{cause:404}))
    }
     return res.status(200).json({message:'user soft deleted '})
    }
//7-logout
// export const logOut =  (req, res,next) => {
// }

//8 – confirm email

export const confirmEmail = async(req,res,next)=>{
const {token} = req.params 
const payload = jwt.verify(token,process.env.AUTHSIGNETURE)
// if(!payload?.email){
//     return res.json({message:"invalid payload"})
// }
const user = await userModel.findOneAndUpdate({email: payload.email},{confirmEmail:true})
return user? res.redirect('http://127.0.0.1:5501/login.html') : res.redirect ('http://127.0.0.1:5501/signup.html')
}
//9 – forget & unsubscribe
export const  unsubscribeuser =async (req,res,next)=>{
    const {token} = req.params 
const payload = jwt.verify(token,process.env.AUTHSIGNETURE)
// if(!payload?.email){
//     return res.json({message:"invalid payload"})
// }
const user = await userModel.findOneAndUpdate({email: payload.email},{confirmEmail:true})
if( !user) {
   return res.redirect ('http://127.0.0.1:5501/login.html')
}
const deleteuser = await userModel.findOneAndDelete({email: user.email})
return res.json({message:"you unsubscribed"})
}
//10-view
export const view = async(req,res,next)=>{
    const {_id} = req.params
    const view = await userModel.findById({_id}).select('-password')
    if(!view){
        return next(new Error("user not found",{cause:404}))
    }
    return res.json({message:"done",view})
    }
//11-upload profile pic
// export const uploadprofilephoto = async(req,res,next)=>{
//     const {_id} = req.user
//     const user = await userModel.findByIdAndUpdate({_id}, {$set : { profileImage: req.file.finaldest }},{new:true})
// return res.json({message:"done", user})
// }
// //12-upload cover pic
// export const uploadcoverphoto = async(req,res,next)=>{
//     const images = []
//     req.files.forEach(element =>{
// images.push(element.finaldest)
//     })
//     const {_id} = req.user
//     const user = await userModel.findByIdAndUpdate({_id},{$set : { coverImage:images }},{new:true})
// return res.json({message:"done", user})
// }

export const uploadprofilephoto = async(req,res,next)=>{
    const {public_id , secure_url} = await cloudinary.uploader.upload(req.file.path,{folder : 'profileImage'})
    const user = await userModel.findByIdAndUpdate({_id:req.user._id},{profileImage:{public_id , secure_url}},{new:true})
return res.json({message:"done", user})
}


export const uploadcoverphoto = async(req,res,next)=>{
    const images = []
    const files = req.files
    for (const file of files) {
        const {public_id , secure_url} = await cloudinary.uploader.upload(req.file.path,
            {folder : 'coverImage'})
    images.push({public_id , secure_url})
}
    const user = await userModel.findByIdAndUpdate({_id},{$set : { coverImage:images }},{new:true})
return res.json({message:"done", user})
}



