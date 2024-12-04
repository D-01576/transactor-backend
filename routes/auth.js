const express = require("express");
const { User } = require("../Database/database");
const { z } = require("zod")
const jwt = require("jsonwebtoken")
const auth = express.Router();
require('dotenv').config()
const secret = process.env.SECRET_PASS;

auth.post("/signup", async (req,res) =>{
    const {name,email,password} = req.body;

    try{
        const userverify = z.object({
            name : z.string().min(3,),
            email : z.string().email(),
            password : z.string().min(6),

        })
        userverify.parse({ name, email, password })
        const existing = await User.findOne({email});
        if(existing){
            return res.json({
                status : "fail",
                message : "User already exists"
            })
        }
        
        const user = new User({name,email,password})
        await user.save()
        const token = jwt.sign(user.toObject(), secret, {expiresIn : "30d" })
        return res.json({
            status : "pass",
            message : "registered successfully",
            token : token
        })
    }catch(error){
        return res.json({
            status : "fail",
            message : `something went wrong ${error}`
        })
    }
})

auth.post("/signin", async (req,res)=>{
    const {email,password} = req.body;

    try {
        const userverify = z.object({
            email : z.string().email(),
            password : z.string().min(6)
        })

        userverify.parse({email,password})
        const user  = await User.findOne({email});
        if(!user){
            return res.json({
                status : "fail",
                message : "email or password incorrect!"
            })
        }

        if(user.password == password){
            const token = jwt.sign(user.toObject(), secret, { expiresIn: '30d' });
            return res.json({
                status : "pass",
                message : "Signed IN",
                token  : token 
            })
        }
        return res.json({
            status : "fail",
            message : "email or password incorrect"
        })
    }catch(error){
        return res.json({
            status : "fail",
            message : `somthing went wrong${error}` 
        })
    }
})

auth.get("/verify", async (req,res)=>{
    const { token } = req.headers;
    
    try{
        jwt.verify(token,secret,async (err,decoded)=>{
            if(err){
                res.json({
                    status : "fail",
                    message : "invalid or expired token"
                })
                return
            }

            const email = decoded.email
            const user = await User.findOne({email});
            if(!user){
                res.json({
                    status : "fail",
                    message : "invalid or expired token"
                })
                return
            }

            if(user.password != decoded.password){
                res.json({
                    status : "fail",
                    message : "invalid or expired token"
                })
                return
            }
            res.json({
                status : "pass",
                message : "authorized",
                decoded : user
            })
        })
    }catch{
        res.json({
            status : "fail",
            message : "invalid or expired token"
        })
    }
})

module.exports = {
    auth
}