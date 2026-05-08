const User = require("../modules/User");

const AdminInvite = require("../modules/AdminInvite");

exports.getClients = async()=>{

    return await User.find({
        role:"client"
    }).sort({ createdAt:-1 });
};

exports.getAdmins = async()=>{

    return await User.find({
        role:{ $in:["admin","super_admin"] }
    });
};

exports.inviteAdmin = async(data)=>{

    return await AdminInvite.create(data);
};

exports.getClientById = async(id)=>{

    return await User.findById(id);
};