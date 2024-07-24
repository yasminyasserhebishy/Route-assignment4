import express  from "express"
import bootstrap from './src/bootstrap.js'
import {config} from 'dotenv'

const app = express()
config()
const port = +process.env.PORT


bootstrap(app,express)






app.listen(port,()=>{
    console.log(`app running on port ${port}`);
})