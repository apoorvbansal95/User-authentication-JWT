import jwt from 'jsonwebtoken'
import UserModel from '../models/User.js'

var checkUserAuth=async(req, res, next)=>{
    let token 
    const {authorization}= req.headers
    if (authorization && authorization.startsWith('Bearer')){
        try{
           token=authorization.split(' ')[1]

           //verify token
           const{userID}=jwt.verify(token, "apoorv@123")

           //get user from token
           req.user=await UserModel.findById(userID).select('-password')
           next()
        }
        catch(error){
            console.log(error)
            res.send({"status":"failed", "message":"Unauthorised User"})
            
        }
    }
    else{
        res.send({"status":"failed", "message":"no token generated"})
    }
}
export default checkUserAuth