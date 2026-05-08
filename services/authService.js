const bcrypt = require("bcryptjs");

const User = require("../modules/User");
const AdminInvite = require("../modules/AdminInvite");

exports.signup = async(data)=>{

    const {
        name,
        email,
        phone,
        password
    } = data;

    const existingUser = await User.findOne({ email });

    if(existingUser){

        throw new Error("Email already exists");
    }

    let role = "client";

    const adminInvite = await AdminInvite.findOne({
        email,
        used:false
    });

    if(adminInvite){

        role = "admin";

        adminInvite.used = true;

        await adminInvite.save();
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const user = await User.create({

        name,

        email,

        phone,

        password:hashedPassword,

        role
    });

    return user;
};

exports.login = async(email,password)=>{

    const user = await User.findOne({ email });

    if(!user){

        throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(
        password,
        user.password
    );

    if(!isMatch){

        throw new Error("Invalid credentials");
    }

    return user;
};