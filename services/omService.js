const OMRequest = require("../modules/OMRequest");

exports.createRequest = async(data)=>{

    return await OMRequest.create(data);
};

exports.getClientRequests = async(clientId)=>{

    return await OMRequest
    .find({ clientId })
    .sort({ createdAt:-1 });
};

exports.getAllRequests = async()=>{

    return await OMRequest
    .find()
    .populate("clientId")
    .populate("handledBy")
    .sort({ createdAt:-1 });
};

exports.updateRequestStatus = async(
    id,
    updateData
)=>{

    return await OMRequest.findByIdAndUpdate(
        id,
        updateData,
        { new:true }
    );
};