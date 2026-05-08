module.exports = (data)=>{

    const faults = [];

    if(data.solarVoltage < 10){

        faults.push({
            type:"Low Solar Voltage",
            severity:"medium"
        });
    }

    if(data.batteryVoltage < 11){

        faults.push({
            type:"Battery Critical",
            severity:"high"
        });
    }

    if(data.loadCurrent > 30){

        faults.push({
            type:"Overload",
            severity:"critical"
        });
    }

    return faults;
};