const mongoose = require("mongoose");

const deviceStatusSchema = new mongoose.Schema({

    clientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true
    },

    solarActive:{
        type:Boolean,
        default:true
    },

    batteryActive:{
        type:Boolean,
        default:true
    },

    gridActive:{
        type:Boolean,
        default:false
    },

    inverterStatus:{
        type:String,
        enum:["online","offline","fault"],
        default:"online"
    },

    activeSource:{
        type:String,
        enum:["solar","battery","grid"],
        default:"solar"
    },

    internetStatus:{
        type:String,
        enum:["online","offline"],
        default:"online"
    },

    lastHeartbeat:{
        type:Date,
        default:Date.now
    },

    updatedAt:{
        type:Date,
        default:Date.now
    }

});

module.exports = mongoose.model(
    "DeviceStatus",
    deviceStatusSchema
);