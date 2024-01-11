const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  vTitle: { type: String },
  vAddress: { type: String },
  vEventImage: { type: String },
  vCityId: { type: String },
  isStatus: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  vCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Created By" },
  vUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Updated By" },
  dtStart: Number,
  dtEnd: Number,
  dtCreatedAt: Number,
  dtDeletedAt: Number,
  isUpdated: Boolean,
  dtUpdatedAt: Number,
});

module.exports = mongoose.model("tblEvent", eventSchema);
