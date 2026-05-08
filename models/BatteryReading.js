const mongoose = require("mongoose");

const batteryReadingSchema = new mongoose.Schema({

    clientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    voltage:{
        type:Number,
        default:0
    },

    current:{
        type:Number,
        default:0
    },

    percentage:{
        type:Number,
        default:0
    },

    charging:{
        type:Boolean,
        default:false
    },

    temperature:{
        type:Number,
        default:0
    },

    health:{
        type:String,
        enum:["good","warning","critical"],
        default:"good"
    },

    status:{
        type:String,
        enum:["charging","discharging","idle","fault"],
        default:"idle"
    },

    createdAt:{
        type:Date,
        default:Date.now
    }

});

module.exports = mongoose.model(
    "BatteryReading",
    batteryReadingSchema
);