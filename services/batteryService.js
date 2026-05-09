const BatteryReading =
require("../modules/BatteryReading");


// =========================
// HELPERS
// =========================

// Compute power
const computePower = (voltage, current)=>{
    return voltage * current;
};


// Clamp percentage between 0–100
const normalizePercentage = (value)=>{
    if(value === undefined || value === null) return 0;
    return Math.max(0, Math.min(100, value));
};


// Determine status
const determineStatus = ({
    charging,
    current,
    voltage,
    temperature
})=>{

    // Fault conditions
    if(temperature > 60 || voltage <= 0){
        return "fault";
    }

    if(charging){
        return "charging";
    }

    if(current > 0){
        return "discharging";
    }

    return "idle";
};


// Determine health
const determineHealth = ({
    percentage,
    temperature
})=>{

    if(percentage < 20 || temperature > 55){
        return "critical";
    }

    if(percentage < 40 || temperature > 45){
        return "warning";
    }

    return "good";
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
        percentage = 0,
        charging = false,
        temperature = 0
    } = data;


    // Sanitize inputs
    voltage = Math.max(0, voltage);
    current = Math.max(0, current);
    temperature = Math.max(0, temperature);
    percentage = normalizePercentage(percentage);


    // Compute power if missing
    if(power === undefined || power === null){
        power = computePower(voltage, current);
    }


    // Determine status
    const status =
    determineStatus({
        charging,
        current,
        voltage,
        temperature
    });


    // Determine health
    const health =
    determineHealth({
        percentage,
        temperature
    });


    // Save
    return await BatteryReading.create({

        clientId,

        voltage,

        current,

        power,

        percentage,

        charging,

        temperature,

        health,

        status
    });
};



// =========================
// GET LATEST
// =========================

exports.getLatestByClient = async(clientId)=>{

    return await BatteryReading
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

    return await BatteryReading
    .find({ clientId })
    .sort({ createdAt:-1 })
    .limit(limit);
};



// =========================
// OPTIONAL ANALYTICS
// =========================

exports.getAveragePercentage = async(clientId)=>{

    const result =
    await BatteryReading.aggregate([

        { $match:{ clientId } },

        {
            $group:{
                _id:null,
                avgPercentage:{
                    $avg:"$percentage"
                }
            }
        }
    ]);

    return result[0]?.avgPercentage || 0;
};