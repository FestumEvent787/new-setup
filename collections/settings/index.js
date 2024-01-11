const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({
  isPaymentReminder: { type: Boolean, default: false },
  vGSTNO: { type: String },
  vImportanceNotes: { type: String },
  vWhatsAppAPIkey: { type: String },
  isDeleted: { type: Boolean, default: false },
  vCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Created By" },
  vUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Updated By" },
  dtCreatedAt: Number,
  dtDeletedAt: Number,
  isUpdated: Boolean,
  dtUpdatedAt: Number,
});

module.exports = mongoose.model("tblSetting", settingSchema);
