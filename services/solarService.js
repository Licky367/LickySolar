const SolarReading = require("../modules/SolarReading");


// =========================
// HELPERS (COMPUTATIONS)
// =========================

// Compute power
const computePower = (voltage, current)=>{
    return voltage * current;
};


// Compute efficiency (simple model)
const computeEfficiency = (power, expectedPower = 1000)=>{
    if(expectedPower === 0) return 0;

    const efficiency =
    (power / expectedPower) * 100;

    return Math.min(100, Math.max(0, efficiency));
};


// Determine system status
const determineStatus = ({
    voltage,
    current,
    power,
    temperature
})=>{

    // No production
    if(voltage === 0 || current === 0){
        return "offline";
    }

    // Low production
    if(power < 50){
        return "low";
    }

    // Overheat condition
    if(temperature > 70){
        return "fault";
    }

    return "active";
};


// =========================
// CREATE READING
// =========================

exports.createReading = async(data)=>{

    let {
        clientId,
        voltage = 0,
        current = 0,
        power,
        temperature = 0
    } = data;


    // Validate inputs
    voltage = Math.max(0, voltage);
    current = Math.max(0, current);
    temperature = Math.max(0, temperature);


    // Compute power if not provided
    if(power === undefined || power === null){
        power = computePower(voltage, current);
    }


    // Compute efficiency
    const efficiency =
    computeEfficiency(power);


    // Determine status
    const status =
    determineStatus({
        voltage,
        current,
        power,
        temperature
    });


    // Save clean data
    return await SolarReading.create({

        clientId,

        voltage,

        current,

        power,

        efficiency,

        temperature,

        status
    });
};



// =========================
// GET LATEST READING
// =========================

exports.getLatestByClient = async(clientId)=>{

    return await SolarReading
    .findOne({ clientId })
    .sort({ createdAt:-1 });
};



// =========================
// GET HISTORY
// =========================

exports.getHistoryByClient = async(
    clientId,
    limit = 50
)=>{

    return await SolarReading
    .find({ clientId })
    .sort({ createdAt:-1 })
    .limit(limit);
};



// =========================
// OPTIONAL: ANALYTICS
// =========================

exports.getAveragePower = async(clientId)=>{

    const result =
    await SolarReading.aggregate([

        { $match:{ clientId } },

        {
            $group:{
                _id:null,
                avgPower:{ $avg:"$power" }
            }
        }
    ]);

    return result[0]?.avgPower || 0;
};