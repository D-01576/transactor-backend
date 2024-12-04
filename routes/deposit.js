const express = require("express");
const { verify } = require("../middlewares/verify");
const { User } = require("../Database/database");
const deposit = express.Router();

deposit.post("/deposit", verify, async (req,res)=>{
    const email = res.locals.email;  
    const {amount} = req.body;

    if(amount < 1){
        res.json({
            status: "fail",
            message : "lesser amount"
        })
    }else if(amount > 10000){
        res.json({
            status: "fail",
            message : "larget amount"
        })
    }

    try{
        const user = await User.findOne({ email });

        user.balance += amount;
        const transaction = {
            type : "deposited",
            amount : amount,
            from : null,
            to : null,
        }
        console.log("th")

        user.transactions.push(transaction)
        console.log("th1")

        await user.save()
        res.json({
            status: "pass",
            message: "deposited",
            balance : user.balance
        });

        console.log(user)
        return
    }catch{
        res.json({
            status: "fail",
            message: "User not found or no balance update"
        });
        return
    }
})

module.exports = {
    deposit
}