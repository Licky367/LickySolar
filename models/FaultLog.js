const mongoose = require("mongoose");

const faultLogSchema = new mongoose.Schema({

    clientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    faultType:{
        type:String,
        required:true
    },

    description:{
        type:String,
        required:true
    },

    severity:{
        type:String,
        enum:["low","medium","high","critical"],
        default:"medium"
    },

    source:{
        type:String,
        enum:["solar","battery","grid","inverter","load"],
        default:"solar"
    },

    resolved:{
        type:Boolean,
        default:false
    },

    resolvedAt:{
        type:Date
    },

    createdAt:{
        type:Date,
        default:Date.now
    }

});

module.exports = mongoose.model(
    "FaultLog",
    faultLogSchema
);