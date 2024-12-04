const { mongoose } = require("mongoose")
require('dotenv').config();

mongoose.connect(process.env.MONGO_ID)

const TransactionSchema = new mongoose.Schema({
    type : {
        type : String,
        required : true,
        enum: ['received', 'sent', 'deposited']
    },
    amount : {type : Number, required : true},
    from : {type: String, required : function() {return this.type === "received"}},
    to : {type: String, required : function() {return this.type === "sent"}},
    date : {type: Date, default :Date.now()}
})

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 100 },
    transactions : {type : [TransactionSchema], default : []}
});

const User = mongoose.model("User",UserSchema)
module.exports = {
    User
}