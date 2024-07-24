import userRouter from './modules/user/user.router.js'
import taskRouter from './modules/task/task.router.js'
import connection from './DB/connection.js'
import {globalError} from './utils/asyncHandler.js'
const bootstrap = (app,express)=>{
app.use('/src/uploads',express.static('src/uploads'))
    connection()
app.use(express.json())
app.use('/user',userRouter)
app.use('/task',taskRouter)
app.use('*',(req,res,next)=>{
    return res.json({message:"invalid url"})
})
app.use(globalError)
}

export default bootstrap

