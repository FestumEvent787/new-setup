const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  vName: { type: String },
  vProfileImage: { type: String },
  vMobile: { type: String },
  vAddress: { type: String },
  vCityId: { type: String },
  vPhoneOtp: { type: String },
  vLoginToken: { type: String },
  isStatus: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  vUserRole: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
  vCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Created By" },
  vUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Updated By" },
  dtCreatedAt: Number,
  dtDeletedAt: Number,
  isUpdated: Boolean,
  dtUpdatedAt: Number,
});

module.exports = mongoose.model("tblUser", userSchema);
