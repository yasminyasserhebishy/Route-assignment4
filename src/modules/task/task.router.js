import Router from 'express'
import { asyncHandler } from '../../utils/asyncHandler.js'
import {addtask, deleteTask, getTasksOfUser, tasksWuser, updateTask,incompletetasks,uploadattachmen} from './controller/task.controller.js'
import validation from '../../midelware/validation.js'
import {taskValidationSchema,updatetaskschema,uploadattachmenschema} from './task.validation.js'
import auth from '../../midelware/auth.js'
import uploadFile, { fileValidation } from '../../utils/uploadFile.js'

const router = Router()

router.post('/addtask',validation(taskValidationSchema),asyncHandler(auth),asyncHandler(addtask))
router.patch ('/update/:_id',validation(updatetaskschema),asyncHandler(auth),asyncHandler(updateTask))
router.delete ('/delete/:_id',asyncHandler(auth),asyncHandler(deleteTask))
router.get('/taskWuser',asyncHandler(tasksWuser))
router.get('/tasksofuser',asyncHandler(auth),asyncHandler(getTasksOfUser))
router.get('/incompletetasks',asyncHandler(incompletetasks))
router.patch('/uploadattachmen/:_id',asyncHandler(auth),uploadFile({customValidation:fileValidation.pdf,custompath:'task/attachment'}).array('attachment',3),validation(uploadattachmenschema),asyncHandler(uploadattachmen))

export default router 