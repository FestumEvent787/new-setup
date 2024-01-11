const mongoose = require("mongoose");

const transportSchema = new mongoose.Schema({
  vCompanyName: { type: String },
  vContactPerson: { type: String },
  vReferenceBy: { type: String },
  vTransportImage: { type: String },
  vMobile: { type: String },
  vCityId: { type: String },
  vGSTNO: { type: String },
  isStatus: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  vCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Created By" },
  vUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Updated By" },
  dtCreatedAt: Number,
  dtDeletedAt: Number,
  isUpdated: Boolean,
  dtUpdatedAt: Number,
});

module.exports = mongoose.model("tblTransport", transportSchema);
