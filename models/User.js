const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
        trim:true
    },

    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },

    phone:{
        type:String,
        required:true
    },

    password:{
        type:String,
        required:true
    },

    role:{
        type:String,
        enum:["super_admin","admin","client"],
        default:"client"
    },

    active:{
        type:Boolean,
        default:true
    },

    createdAt:{
        type:Date,
        default:Date.now
    }

});

module.exports = mongoose.model("User", userSchema);