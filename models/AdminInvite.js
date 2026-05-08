const mongoose = require("mongoose");

const adminInviteSchema = new mongoose.Schema({

    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },

    invitedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    used:{
        type:Boolean,
        default:false
    },

    createdAt:{
        type:Date,
        default:Date.now
    }

});

module.exports = mongoose.model("AdminInvite", adminInviteSchema);