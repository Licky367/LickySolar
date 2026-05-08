const mongoose = require("mongoose");

const omRequestSchema = new mongoose.Schema({

    clientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    title:{
        type:String,
        required:true
    },

    description:{
        type:String,
        required:true
    },

    status:{
        type:String,
        enum:[
            "pending",
            "in_progress",
            "resolved",
            "closed"
        ],
        default:"pending"
    },

    adminResponse:{
        type:String,
        default:""
    },

    handledBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
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
    "OMRequest",
    omRequestSchema
);