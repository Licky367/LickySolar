const mongoose = require("mongoose");

const irradianceForecastSchema = new mongoose.Schema(
  {
    date: { type: String, required: true }, // YYYY-MM-DD

    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },

    ghi: { type: Number, default: 0 },
    dni: { type: Number, default: 0 },
    dhi: { type: Number, default: 0 },
    temp: { type: Number, default: 0 },

    source: { type: String, default: "NASA_POWER" }
  },
  { timestamps: true }
);

// Unique per day + location
irradianceForecastSchema.index(
  { date: 1, latitude: 1, longitude: 1 },
  { unique: true }
);

module.exports = mongoose.model("IrradianceForecast", irradianceForecastSchema);