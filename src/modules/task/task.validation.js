import Joi from 'joi'
import { generalfields } from '../../utils/generalfields.js'
import { idvalidation } from '../../midelware/validation.js'


export const taskValidationSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    status: Joi.string().valid('toDo', 'doing', 'done').default('toDo'),
    assignTo: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    deadline: Joi.date().required(),
  }).required()

export const updatetaskschema = Joi.object({
  _id :Joi.custom(idvalidation).required(),
    title: Joi.string(),
    description: Joi.string(),
    status: Joi.string().valid('toDo', 'doing', 'done'),
  }).required()

export const uploadattachmenschema =Joi.object({
  files:generalfields.files,
  _id :generalfields._id,
  }).required()

