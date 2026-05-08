require("dotenv").config();

const bcrypt = require("bcryptjs");

const connectDB = require("./db");

const User = require("../modules/User");

const seedSuperAdmin = async()=>{

    try{

        await connectDB();

        const existing = await User.findOne({
            role:"super_admin"
        });

        if(existing){

            console.log("Super admin already exists");

            process.exit();
        }

        const hashedPassword = await bcrypt.hash(
            process.env.SUPER_ADMIN_PASSWORD,
            10
        );

        await User.create({

            name:"Super Admin",

            email:process.env.SUPER_ADMIN_EMAIL,

            phone:"0000000000",

            password:hashedPassword,

            role:"super_admin"
        });

        console.log("Super admin seeded");

        process.exit();

    }catch(error){

        console.log(error);

        process.exit(1);
    }
};

seedSuperAdmin();