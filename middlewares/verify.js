const jwt = require("jsonwebtoken")
const dotenv = require("dotenv");
const { User } = require("../Database/database");
dotenv.config()
const secret = process.env.SECRET_PASS

async function verify(req,res,next){
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
            res.locals.email = decoded.email;
            next()
        })
    }catch{
        res.json({
            status : "fail",
            message : "invalid or expired token"
        })
    }
}

module.exports = {
    verify
}