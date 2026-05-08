const mongoose = require("mongoose");

const sourceTransitionSchema = new mongoose.Schema({

    clientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    fromSource:{
        type:String,
        enum:["solar","battery","grid"],
        required:true
    },

    toSource:{
        type:String,
        enum:["solar","battery","grid"],
        required:true
    },

    reason:{
        type:String,
        required:true
    },

    solarVoltage:{
        type:Number,
        default:0
    },

    batteryVoltage:{
        type:Number,
        default:0
    },

    gridVoltage:{
        type:Number,
        default:0
    },

    loadPower:{
        type:Number,
        default:0
    },

    createdAt:{
        type:Date,
        default:Date.now
    }

});

module.exports = mongoose.model(
    "SourceTransition",
    sourceTransitionSchema
);