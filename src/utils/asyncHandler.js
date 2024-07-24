export const asyncHandler = (fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch((error)=>{

return next(new Error (error,{cause:500}))
        })
    }
    }

// 500 --> internal server error 
// next ? 


export const globalError = (error,req,res,next)=>{
    const validationresult = req.validationresult
    if(validationresult){
        return res.status(error.cause || 400).json({message: error.message , validationresult  })
    }
    return res.status(error.cause || 400).json({message: error.message , stack : error.stack
    })
    }

//400 --> bad request


