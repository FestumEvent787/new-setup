const mongoose = require("mongoose");

const salesReturnItemSchema = new mongoose.Schema({
  vSReturnId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sales Return Id",
  },
  vSRId: { type: String, required: true },
  vStockId: { type: String, required: true },
  iReturnQty: { type: Number, default: 0 },
  iOldReturnQty: { type: Number, default: 0 },
  dSalesRate: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false },
  vCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Created By" },
  vUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Updated By" },
  dtCreatedAt: Number,
  dtDeletedAt: Number,
  isUpdated: Boolean,
  dtUpdatedAt: Number,
});

module.exports = mongoose.model("tblSalesReturnItem", salesReturnItemSchema);
