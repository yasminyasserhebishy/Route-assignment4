import { Types } from "mongoose"

export const idvalidation =(value,helper)=>{
    return Types.ObjectId.isValid(value) ? true : helper.message('invalid id')
}
const validation = (schema)=>{
return (req,res,next)=>{
 try {
    let methods 
    if (req.headers.auth){
        methods = {...req.body , ...req.params , ...req.query,auth :req.headers.auth}
    }else {
        methods = {...req.body , ...req.params , ...req.query}
    }
    if(req.file){
        methods = {...methods, file: req.file}
    }
    if(req.files){
        methods = {...methods, files: req.files}
    }
    const validation = schema.validate(methods,{abortEarly:false}) 
    if(validation?.error){
       // return res.status(403).json({message:"done",result : validation.error.details})
       req.validationresult =  validation.error.details
        return next (new Error ('validation error',{cause : 403}))
    }
   return next()
}
 catch (error) {
    return res.json({message: error.message , stack : error.stack})
    }
}}
export default validation 
//403 -->  Forbidden error