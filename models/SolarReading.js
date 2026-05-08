const mongoose = require("mongoose");

const solarReadingSchema = new mongoose.Schema({

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

    power:{
        type:Number,
        default:0
    },

    efficiency:{
        type:Number,
        default:0
    },

    temperature:{
        type:Number,
        default:0
    },

    status:{
        type:String,
        enum:["active","low","offline","fault"],
        default:"active"
    },

    createdAt:{
        type:Date,
        default:Date.now
    }

});

module.exports = mongoose.model(
    "SolarReading",
    solarReadingSchema
);