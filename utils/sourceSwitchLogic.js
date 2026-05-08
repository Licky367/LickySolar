module.exports = ({
    solarVoltage,
    batteryVoltage
})=>{

    if(
        solarVoltage < 10 &&
        batteryVoltage < 11
    ){

        return {
            source:"grid",
            reason:"Low solar and battery"
        };
    }

    if(solarVoltage >= 10){

        return {
            source:"solar",
            reason:"Solar sufficient"
        };
    }

    return {
        source:"battery",
        reason:"Battery backup active"
    };
};