require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const expressLayouts = require("express-ejs-layouts");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const solarRoutes = require("./routes/solarRoutes");
const batteryRoutes = require("./routes/batteryRoutes");
const gridRoutes = require("./routes/gridRoutes");
const faultRoutes = require("./routes/faultRoutes");
const omRoutes = require("./routes/omRoutes");
const adminRoutes = require("./routes/adminRoutes");
const irradianceRoutes = require("./routes/irradianceRoutes");

const app = express();

/* =========================
   DATABASE
========================= */

connectDB();

/* =========================
   MIDDLEWARES
========================= */

app.use(express.json());

app.use(express.urlencoded({
    extended:true
}));

app.use(methodOverride("_method"));

app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
        secure:false,
        maxAge:1000 * 60 * 60 * 24
    }
}));

app.use(flash());

/* =========================
   GLOBAL VARIABLES
========================= */

app.use((req,res,next)=>{

    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");

    res.locals.currentUser = req.session.user || null;

    next();
});

/* =========================
   VIEW ENGINE
========================= */

app.use(expressLayouts);

app.set("layout","layout");

app.set("view engine","ejs");

app.set("views", path.join(__dirname,"views"));

/* =========================
   STATIC FILES
========================= */

app.use(express.static(path.join(__dirname,"public")));

/* =========================
   ROUTES
========================= */

app.use("/", authRoutes);

app.use("/", dashboardRoutes);

app.use("/solar", solarRoutes);

app.use("/battery", batteryRoutes);

app.use("/grid", gridRoutes);

app.use("/faults", faultRoutes);

app.use("/om", omRoutes);

app.use("/admin", adminRoutes);

app.use("/irradiance", irradianceRoutes);

/* =========================
   404
========================= */

app.use((req,res)=>{

    res.status(404).render("errors/404",{
        title:"404"
    });
});

/* =========================
   ERROR HANDLER
========================= */

app.use((err,req,res,next)=>{

    console.log(err);

    res.status(500).render("errors/500",{
        title:"Server Error",
        error:err
    });
});

/* =========================
   SERVER
========================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{

    console.log(`Server running on port ${PORT}`);
});
