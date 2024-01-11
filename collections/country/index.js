const mongoose = require("mongoose");

const citySchema = mongoose.Schema(
  {
    _id: { type: Number },
    vCityName: { type: String },
  },
  { _id: false }
);

const stateSchema = mongoose.Schema(
  {
    _id: { type: Number },
    vStateName: { type: String },
    arrCityList: [citySchema],
  },
  { _id: false }
);

const countrySchema = mongoose.Schema(
  {
    _id: { type: Number },
    vCountryName: { type: String },
    arrStateList: [stateSchema],
  },
  { _id: false }
);

const countryListSchema = new mongoose.Schema({
  arrCountryJson: [countrySchema],
  isDeleted: { type: Boolean, default: false },
});

module.exports = mongoose.model("tblCountry", countryListSchema);
