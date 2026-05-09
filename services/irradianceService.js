const IrradianceForecast = require("../models/IrradianceForecast");
const { fetchNasaPowerDaily } = require("./nasaPowerService");

// YYYY-MM-DD -> YYYYMMDD
function compactDate(dateStr) {
  return dateStr.replaceAll("-", "");
}

// YYYYMMDD -> YYYY-MM-DD
function expandDate(dateStr) {
  return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
}

function getTodayDateString() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function getWeekRange(dateStr) {
  const d = new Date(dateStr);
  const day = d.getDay();

  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMonday);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    start: monday.toISOString().slice(0, 10),
    end: sunday.toISOString().slice(0, 10)
  };
}

function getMonthRange(dateStr) {
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = d.getMonth();

  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);

  return {
    start: first.toISOString().slice(0, 10),
    end: last.toISOString().slice(0, 10)
  };
}

function getYearRange(dateStr) {
  const d = new Date(dateStr);
  const year = d.getFullYear();

  return {
    start: `${year}-01-01`,
    end: `${year}-12-31`
  };
}

async function syncForecastFromNasa(lat, lon, startDate, endDate) {
  const startCompact = compactDate(startDate);
  const endCompact = compactDate(endDate);

  const data = await fetchNasaPowerDaily(lat, lon, startCompact, endCompact);

  const ghiData = data.ALLSKY_SFC_SW_DWN || {};
  const dniData = data.ALLSKY_SFC_SW_DNI || {};
  const dhiData = data.ALLSKY_SFC_SW_DIFF || {};
  const tempData = data.T2M || {};

  const dates = Object.keys(ghiData);

  for (let dt of dates) {
    const date = expandDate(dt);

    const record = {
      date,
      latitude: lat,
      longitude: lon,
      ghi: ghiData[dt] ?? 0,
      dni: dniData[dt] ?? 0,
      dhi: dhiData[dt] ?? 0,
      temp: tempData[dt] ?? 0,
      source: "NASA_POWER"
    };

    await IrradianceForecast.updateOne(
      { date, latitude: lat, longitude: lon },
      { $set: record },
      { upsert: true }
    );
  }
}

async function getForecastBetween(lat, lon, startDate, endDate) {
  return await IrradianceForecast.find({
    latitude: lat,
    longitude: lon,
    date: { $gte: startDate, $lte: endDate }
  }).sort({ date: 1 });
}

module.exports = {
  getTodayDateString,
  getWeekRange,
  getMonthRange,
  getYearRange,
  syncForecastFromNasa,
  getForecastBetween
};