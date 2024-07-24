import Router from 'express'
import * as userController from './controller/user.controller.js'
import auth from '../../midelware/auth.js'
import  validation  from '../../midelware/validation.js'
import * as userSchema from './user.validation.js' 
import {asyncHandler} from '../../utils/asyncHandler.js'
import uploadFile, { fileValidation } from '../../utils/uploadFile.js'
const router = Router()

router.post('/signup',validation(userSchema.signupSchema),asyncHandler(userController.signUp))
router.post('/login',validation(userSchema.loginSchema),asyncHandler(userController.login))
router.patch('/update',validation(userSchema.updateschema),asyncHandler(auth),asyncHandler(userController.updateuser))
router.delete('/delete',asyncHandler(auth),asyncHandler(userController.deleteuser))
router.patch('/softdelete',asyncHandler(auth),asyncHandler(userController.softdelete))
router.get('/confirmEmail/:token',asyncHandler(userController.confirmEmail))
router.get('/unsubscribe/:token',asyncHandler(userController.unsubscribeuser))
router.get('/profile',asyncHandler(auth),asyncHandler(userController.profile))
router.patch('/changepassword',validation(userSchema.changepassschema),asyncHandler(auth),asyncHandler(userController.changepassword))
router.get('/view/:_id',validation(userSchema.viewschema),asyncHandler(userController.view))
//router.patch('/uploadprofilephoto',asyncHandler(auth),uploadFile({customValidation:fileValidation.image,custompath:'user/profile'}).single('myphoto'),validation(uploadprofileimage),uploadprofilephoto)
//router.patch('/uploadcoverphoto',asyncHandler(auth),uploadFile({customValidation:fileValidation.image,custompath:'user/cover'}).array('myphoto',6),validation(uploadcoverimage),uploadcoverphoto)
//router.post('/logout', auth, logOut);
//router.get('/forgetpassword/:token',asyncHandler(forgetpassword))
//router.post('/logout',asyncHandler(auth),asyncHandler(logout))
//router.get('/refreshToken/:token',asynchandler(refreshToken))

router.patch('/uploadprofilephoto',asyncHandler(auth),uploadFile({customValidation:fileValidation.image}).single('myphoto'),userController.uploadprofilephoto)
router.patch('/uploadcoverphoto',asyncHandler(auth),uploadFile({customValidation:fileValidation.image}).array('myphoto',6),userController.uploadcoverphoto) 



export default router 