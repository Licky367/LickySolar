const mongoose = require("mongoose");

const deviceStatusSchema = new mongoose.Schema({

    // =========================
    // RELATION
    // =========================

    clientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null
    },


    // =========================
    // DEVICE IDENTITY
    // =========================

    deviceId:{
        type:String,
        unique:true,
        required:true
    },

    // 🔥 NEW: MAC ADDRESS (PHYSICAL DEVICE ID)
    macAddress:{
        type:String,
        unique:true,
        sparse:true, // allows null but enforces uniqueness when present
        trim:true
    },

    // 🔐 API AUTH KEY (ESP32 USES THIS)
    apiKey:{
        type:String,
        required:true
    },


    // =========================
    // DEVICE META
    // =========================

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


    // =========================
    // SYSTEM STATUS FLAGS
    // =========================

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


    // =========================
    // ACTIVE SOURCE
    // =========================

    activeSource:{
        type:String,
        enum:["solar","battery","grid"],
        default:"solar"
    },


    // =========================
    // NETWORK STATUS
    // =========================

    internetStatus:{
        type:String,
        enum:["online","offline"],
        default:"offline"
    },

    lastHeartbeat:{
        type:Date,
        default:null
    },


    // =========================
    // OPTIONAL ADVANCED METRICS
    // =========================

    lastSolarPower:{
        type:Number,
        default:0
    },

    lastBatteryLevel:{
        type:Number,
        default:0
    },

    lastLoadPower:{
        type:Number,
        default:0
    },


    // =========================
    // TIMESTAMPS
    // =========================

    createdAt:{
        type:Date,
        default:Date.now
    }

});

module.exports = mongoose.model(
    "DeviceStatus",
    deviceStatusSchema
);