const mongoose = require("mongoose");

const deviceStatusSchema = new mongoose.Schema({

    clientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null
    },

    deviceId:{
        type:String,
        unique:true,
        required:true
    },

    apiKey:{
        type:String,
        required:true
    },

    name:{
        type:String,
        default:"Solar Device"
    },

    location:{
        type:String,
        default:""
    },

    assigned:{
        type:Boolean,
        default:false
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
        default:"offline"
    },

    lastHeartbeat:{
        type:Date,
        default:Date.now
    },

    createdAt:{
        type:Date,
        default:Date.now
    }

});

module.exports = mongoose.model(
    "DeviceStatus",
    deviceStatusSchema
);