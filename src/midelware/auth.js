import jwt from 'jsonwebtoken'
import usermodel from '../DB/models/User.model.js'


const auth = async (req, res, next) => {
    const { auth1, auth2 } = req.headers;
  
    if (!auth1 && !auth2) {
      return next(new Error('Please login'));
    }
  
    if (auth1) {
      const userToken = auth1.split(process.env.BEARERtOKEN)[1];
  
      if (!userToken) {
        return next(new Error('Invalid user token'));
      }
  
      const userPayload = jwt.verify(userToken, process.env.AUTHSIGNETURE);
  
      if (!userPayload?._id) {
        return next(new Error('Invalid user payload'));
      }
  
      const user = await usermodel.findOne({ _id: userPayload._id }).select('-password');
  
      if (!user) {
        return next(new Error('User not found'));
      }
  
      req.user = user;
    }
  
    if (auth2) {
      const assignToToken = auth2.split(process.env.BEARERtOKEN)[1];
  
      if (!assignToToken) {
        return next(new Error('Invalid assign-to token'));
      }
  
      const assignToPayload = jwt.verify(assignToToken, process.env.AUTHSIGNETURE);
  
      if (!assignToPayload?._id) {
        return next(new Error('Invalid assign-to payload'));
      }
  
      const assignToUser = await usermodel.findOne({ _id: assignToPayload._id }).select('-password');
  
      if (!assignToUser) {
        return next(new Error('Assigned-to user not found'));
      }
  
      req.assignToUser = assignToUser;
    }
  
    next();
  };
export default auth; 


// const auth = async(req,res,next)=>{
// const {auth} = req.headers
//  if(!auth){
//     return next(new Error ('please login'))
//  }
//  const token = auth.split(process.env.BEARERtOKEN)[1]
// if(!token){
//     return next(new Error ('invalid token'))
// }
// const payload = jwt.verify(token,process.env.AUTHSIGNETURE)
// if(!payload?._id){
//     return next(new Error ('invalid payload'))
// }
// const user = await usermodel.findOne({_id:payload._id}).select('-password')
// if(!user){
//     return next(new Error ('user not found'))
// }
// req.user = user
// next()
// }
