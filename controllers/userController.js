import UserModel from "../models/User.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()



class UserController{
    static userRegistration =async (req, res)=>{
        const {name, email , password , password_confirmation, tc}= req.body
        const user=await UserModel.findOne({email:email})
        if (user){
            res.send({"status":"failed", "message":"Email already exist"})
        }
        else {
            if (name && password && email && password_confirmation && tc) {
                if (password === password_confirmation) {
                    const salt = await bcrypt.genSalt(10)
                    const hashedpassword=await bcrypt.hash(password, salt)
                    const doc = new UserModel({
                        name: name,
                        email: email,
                        password: hashedpassword,
                        tc: tc
                    })
                    await doc.save()
                    const saved_user=await UserModel.findOne({email:email})
                    // generate JWT token
                    const token=jwt.sign({userID:saved_user._id}, "apoorv@123", {expiresIn: '5d'}) // id that is saved in mongo db

                    res.send({"status":"success", "message":"user saved successfully", "token":token})
                }
                else{
                    res.send({"status":"failed", "message":"password does not match"})
                }
             }
             else{
                res.send({"status":"failed", "message":"please fill all details "})
             }
        }
    }

    static userLogin=async(req, res)=>{
        try {
            const { email, password } = req.body
            if (email && password) {
                const user = await UserModel.findOne({ email: email })
                if (user) {
                  const isMatch=await bcrypt.compare(password, user.password)
                  if((email===user.email) && isMatch){
                    
                    // generate JWT token
                    const token=jwt.sign({userID:user._id}, "apoorv@123", {expiresIn: '5d'}) // id that is saved in mongo db
                    res.send({ "status": "200", "meassge": "Successfully login" ,"token":token})
                  }
                  else{
                    res.send({ "status": "400", "meassge": "password or email does not match" })
                  }
                }
                else {
                    res.send({ "status": "400", "meassge": "email not registered" })
                }
            }
            else {
                res.send({ "status": "400", "meassge": "all fields required" })

            }
        }
        catch(error){
            console.log(error)
        }
    }

    static changeUSerPassword =async(req, res)=>{
        const {password, password_confirmation}=req.body
        if (password && password_confirmation){
           if (password===password_confirmation){
            const salt = await bcrypt.genSalt(10)
            const newhashedpassword=await bcrypt.hash(password, salt)
             await UserModel.findByIdAndUpdate(req.user._id, {$set: {password: newhashedpassword}} )

            res.send({ "status": "success", "meassge": "password changed successfully" })
           }
           else{
            res.send({ "status": "400", "meassge": "password and new password does not match" })
           }
        }
        else{
            res.send({ "status": "400", "meassge": "all fields required" })
        }
    }
    static loggedUser= async(req, res)=>{
        res.send({"user":req.user})
    }

    static sendUSerPasswordResetEmail =async(req, res)=>{
        const {email}= req.body
        if(email){
        const user=await UserModel.findOne({email:email})
        
        if (user){
            const secret = user._id + "apoorv@123"
            const token = jwt.sign({ userID: user._id }, secret, { expiresIn: '15m' })
            const link = `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`
            console.log(link)
            res.send({ "status": "success", "meassge": "reset link send" })
        }
        else{
            res.send({ "status": "400", "meassge": "This mail not registered" })
        }
        }
        else{
            res.send({ "status": "400", "meassge": "all fields required" })
        }
    }
    static userPasswordReset=async(req, res)=>{
        const{password, confirm_password}=req.body
        const{id, token}= req.params
        const user=await UserModel.findById(id)
        const new_secret=user._id+"apoorv@123"
        try{
         jwt.verify(token, new_secret)
          if (password && confirm_password){
             if (password===confirm_password){
              const salt= await bcrypt.genSalt(10)
              const newhashedpassword=await bcrypt.hash(password,salt)
              await UserModel.findByIdAndUpdate(req.user._id, {$set: {password: newhashedpassword}} )

            res.send({ "status": "success", "meassge": "password changed successfully" })
             }
             else{
                res.send({ "status": "400", "messge": "password and confirm password does not match , pls check " })
             }
          } 
          else{
            res.send({ "status": "400", "messge": "all fields required" })
          }

        }catch(error){
            console.log(error)
            res.send({ "status": "failed", "messge": "Invalid token" })
        }


    }

}

export default UserController