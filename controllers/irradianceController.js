const {
  getTodayDateString,
  getWeekRange,
  getMonthRange,
  getYearRange,
  syncForecastFromNasa,
  getForecastBetween
} = require("../services/irradianceService");

function normalizeMongoData(data) {
  return data.map(r => ({
    date: r.date,
    ghi: r.ghi,
    dni: r.dni,
    dhi: r.dhi,
    temp: r.temp
  }));
}

exports.irradianceDashboard = async (req, res) => {
  try {
    const today = getTodayDateString();

    const selectedDate = req.query.date || today;

    const latitude = req.query.lat ? Number(req.query.lat) : null;
    const longitude = req.query.lon ? Number(req.query.lon) : null;

    // Default location if user doesn't input
    const defaultLat = -1.28333;
    const defaultLon = 36.81667;

    const lat = latitude !== null ? latitude : defaultLat;
    const lon = longitude !== null ? longitude : defaultLon;

    // Validate GPS
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return res.render("irradianceDashboard", {
        title: "Solar Irradiance Forecast",
        selectedDate: today,
        lat: defaultLat,
        lon: defaultLon,
        dayData: [],
        weekData: [],
        monthData: [],
        yearData: [],
        error: "Invalid GPS coordinates entered."
      });
    }

    // Reject past dates
    if (selectedDate < today) {
      return res.render("irradianceDashboard", {
        title: "Solar Irradiance Forecast",
        selectedDate: today,
        lat,
        lon,
        dayData: [],
        weekData: [],
        monthData: [],
        yearData: [],
        error: "Past dates are not allowed. Showing today's forecast."
      });
    }

    // NASA sync for full year range of selected date
    const yearRange = getYearRange(selectedDate);
    await syncForecastFromNasa(lat, lon, yearRange.start, yearRange.end);

    // DAY
    const dayData = await getForecastBetween(lat, lon, selectedDate, selectedDate);

    // WEEK
    const weekRange = getWeekRange(selectedDate);
    const weekData = await getForecastBetween(lat, lon, weekRange.start, weekRange.end);

    // MONTH
    const monthRange = getMonthRange(selectedDate);
    const monthData = await getForecastBetween(lat, lon, monthRange.start, monthRange.end);

    // YEAR
    const yearData = await getForecastBetween(lat, lon, yearRange.start, yearRange.end);

    return res.render("irradianceDashboard", {
      title: "Solar Irradiance Forecast",
      selectedDate,
      lat,
      lon,
      dayData: normalizeMongoData(dayData),
      weekData: normalizeMongoData(weekData),
      monthData: normalizeMongoData(monthData),
      yearData: normalizeMongoData(yearData),
      error: null
    });
  } catch (err) {
    console.error("Irradiance Dashboard Error:", err);

    return res.render("irradianceDashboard", {
      title: "Solar Irradiance Forecast",
      selectedDate: req.query.date || "",
      lat: req.query.lat || "",
      lon: req.query.lon || "",
      dayData: [],
      weekData: [],
      monthData: [],
      yearData: [],
      error: "Failed to load irradiance forecast data."
    });
  }
};