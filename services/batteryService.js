const BatteryReading = require("../modules/BatteryReading");

exports.createReading = async(data)=>{

    return await BatteryReading.create(data);
};

exports.getLatestByClient = async(clientId)=>{

    return await BatteryReading
    .findOne({ clientId })
    .sort({ createdAt:-1 });
};

exports.getHistoryByClient = async(clientId)=>{

    return await BatteryReading
    .find({ clientId })
    .sort({ createdAt:-1 });
};