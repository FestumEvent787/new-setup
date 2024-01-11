const mongoose = require("mongoose");

const salesReturnSchema = new mongoose.Schema({
  vSRId: { type: String, required: true },
  vCustomerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer Id" },
  iDeliveryChallan: Number,
  dtBillDate: Number,
  dtReturnDate: Number,
  iBillNumber: { type: Number, default: 0 },
  iLRNumber: { type: Number, default: 0 },
  vNotes: { type: String, default: "" },
  isComplete: { type: Boolean, default: false },
  isStatus: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  vCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Created By" },
  vUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Updated By" },
  dtCreatedAt: Number,
  dtDeletedAt: Number,
  isUpdated: Boolean,
  dtUpdatedAt: Number,
});

module.exports = mongoose.model("tblSalesReturn", salesReturnSchema);
