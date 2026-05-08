const SolarReading = require("../modules/SolarReading");

exports.createReading = async(data)=>{

    return await SolarReading.create(data);
};

exports.getLatestByClient = async(clientId)=>{

    return await SolarReading
    .findOne({ clientId })
    .sort({ createdAt:-1 });
};

exports.getHistoryByClient = async(clientId)=>{

    return await SolarReading
    .find({ clientId })
    .sort({ createdAt:-1 });
};