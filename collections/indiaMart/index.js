const mongoose = require("mongoose");

const indiaMartSchema = new mongoose.Schema({
  vCompanyName: { type: String },
  vContactPerson: { type: String },
  arrIndiaMartImage: [],
  vMobile: { type: String },
  vAddress: { type: String },
  vCityId: { type: String },
  vTraderOrUser: { type: String },
  vRemark: { type: String },
  isDeleted: { type: Boolean, default: false },
  vCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Created By" },
  vUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Updated By" },
  dtCreatedAt: Number,
  dtDeletedAt: Number,
  isUpdated: Boolean,
  dtUpdatedAt: Number,
});

module.exports = mongoose.model("tblIndiaMart", indiaMartSchema);
