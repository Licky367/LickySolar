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

    // New: mode & panel area
    const mode = req.query.mode || "irradiance";
    const areaInput = req.query.area ? Number(req.query.area) : 0;

    // If invalid area, set to 1
    const area = areaInput > 0 ? areaInput : 1;

    // Default location if user doesn't input
    const defaultLat = -1.28333;
    const defaultLon = 36.81667;

    const lat = latitude !== null ? latitude : defaultLat;
    const lon = longitude !== null ? longitude : defaultLon;

    // Validate GPS
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return res.render("irradianceDashboard", {
        title: "Solar Forecast Dashboard",
        selectedDate: today,
        lat: defaultLat,
        lon: defaultLon,
        mode,
        area,
        dayData: [],
        weekData: [],
        monthData: [],
        yearData: [],
        error: "Invalid GPS coordinates entered."
      });
    }

    // Validate mode
    if (!["irradiance", "predicted_power"].includes(mode)) {
      return res.render("irradianceDashboard", {
        title: "Solar Forecast Dashboard",
        selectedDate: today,
        lat,
        lon,
        mode: "irradiance",
        area,
        dayData: [],
        weekData: [],
        monthData: [],
        yearData: [],
        error: "Invalid mode selected."
      });
    }

    // Reject past dates
    if (selectedDate < today) {
      return res.render("irradianceDashboard", {
        title: "Solar Forecast Dashboard",
        selectedDate: today,
        lat,
        lon,
        mode,
        area,
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
      title: "Solar Forecast Dashboard",
      selectedDate,
      lat,
      lon,
      mode,
      area,
      dayData: normalizeMongoData(dayData),
      weekData: normalizeMongoData(weekData),
      monthData: normalizeMongoData(monthData),
      yearData: normalizeMongoData(yearData),
      error: null
    });
  } catch (err) {
    console.error("Irradiance Dashboard Error:", err);

    return res.render("irradianceDashboard", {
      title: "Solar Forecast Dashboard",
      selectedDate: req.query.date || "",
      lat: req.query.lat || "",
      lon: req.query.lon || "",
      mode: req.query.mode || "irradiance",
      area: req.query.area || 1,
      dayData: [],
      weekData: [],
      monthData: [],
      yearData: [],
      error: "Failed to load irradiance forecast data."
    });
  }
};