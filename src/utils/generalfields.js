import joi from "joi"
import { idvalidation } from "../midelware/validation.js"
export const generalfields = {
    email : joi.string().email({ tlds: { allow: ['com', 'net'] }}).required(),
    password : joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    _id :joi.custom(idvalidation).required(),
    token :  joi.string().required(),
    file:joi.object({
        size:joi.number().positive().required(),
        path:joi.string().required(),
        filename:joi.string().required(),
        destination:joi.string().required(),
        mimetype:joi.string().required(),
        encoding:joi.string().required(),
        originalname:joi.string().required(),
        fieldname:joi.string().required(),
        finaldest:joi.string().required(),
    }).required(),
    files:joi.array().items(joi.object({
        size:joi.number().positive().required(),
        path:joi.string().required(),
        filename:joi.string().required(),
        destination:joi.string().required(),
        mimetype:joi.string().required(),
        encoding:joi.string().required(),
        originalname:joi.string().required(),
        fieldname:joi.string().required(),
        finaldest:joi.string().required(),
    })).required()
}