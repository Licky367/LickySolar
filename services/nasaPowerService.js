const axios = require("axios");

async function fetchNasaPowerDaily(lat, lon, startDate, endDate) {
  const url = `https://power.larc.nasa.gov/api/temporal/daily/point`;

  const params = {
    parameters: "ALLSKY_SFC_SW_DWN,ALLSKY_SFC_SW_DNI,ALLSKY_SFC_SW_DIFF,T2M",
    community: "RE",
    longitude: lon,
    latitude: lat,
    start: startDate,
    end: endDate,
    format: "JSON"
  };

  const response = await axios.get(url, { params });

  if (!response.data?.properties?.parameter) {
    throw new Error("Invalid NASA POWER response");
  }

  return response.data.properties.parameter;
}

module.exports = { fetchNasaPowerDaily };