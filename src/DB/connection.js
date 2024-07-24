import mongoose from 'mongoose'

const connection = async () => {
   return await mongoose.connect(process.env.URI).then(()=>{
        console.log("connected to database");
        }).catch(()=>{
        console.log("failed to connect to database");
        })

}


export default connection 