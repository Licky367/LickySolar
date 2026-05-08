const mongoose = require("mongoose");

const gridReadingSchema = new mongoose.Schema({

    clientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    available:{
        type:Boolean,
        default:false
    },

    voltage:{
        type:Number,
        default:0
    },

    frequency:{
        type:Number,
        default:0
    },

    source:{
        type:String,
        enum:["solar","battery","grid"],
        default:"solar"
    },

    status:{
        type:String,
        enum:["stable","unstable","offline"],
        default:"stable"
    },

    createdAt:{
        type:Date,
        default:Date.now
    }

});

module.exports = mongoose.model(
    "GridReading",
    gridReadingSchema
);