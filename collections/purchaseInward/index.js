const mongoose = require("mongoose");

const purchaseInwardSchema = new mongoose.Schema({
  vPoId: { type: String, required: true },
  vPInId: { type: String, required: true },
  vTransportationName: { type: String, default: "" },
  dtChallanDate: Number,
  iChallanNO: { type: Number, default: 0 },
  iLRNO: { type: Number, default: 0 },
  iInvoiceNo: { type: Number, default: 0 },
  iEWayBill: { type: Number, default: 0 },
  vChallanImage: { type: String, default: "" },
  vLRImage: { type: String, default: "" },
  vInvoiceImage: { type: String, default: "" },
  vEWayBillImage: { type: String, default: "" },
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

module.exports = mongoose.model("tblPurchaseInward", purchaseInwardSchema);
