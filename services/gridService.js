const GridReading = require("../modules/GridReading");

exports.createReading = async(data)=>{

    return await GridReading.create(data);
};

exports.getLatestByClient = async(clientId)=>{

    return await GridReading
    .findOne({ clientId })
    .sort({ createdAt:-1 });
};

exports.getHistoryByClient = async(clientId)=>{

    return await GridReading
    .find({ clientId })
    .sort({ createdAt:-1 });
};