exports.calculateSolarEfficiency = (
    solarPower,
    loadPower
)=>{

    if(loadPower <= 0){

        return 0;
    }

    return (
        (solarPower / loadPower) * 100
    ).toFixed(2);
};

exports.calculateBatterySOC = (
    voltage
)=>{

    const minVoltage = 11.8;

    const maxVoltage = 12.8;

    const percentage =
    (
        (
            voltage - minVoltage
        ) /
        (
            maxVoltage - minVoltage
        )
    ) * 100;

    return Math.max(
        0,
        Math.min(100, percentage.toFixed(0))
    );
};

exports.calculateGridDependency = (
    gridHours,
    totalHours
)=>{

    if(totalHours <= 0){

        return 0;
    }

    return (
        (gridHours / totalHours) * 100
    ).toFixed(2);
};