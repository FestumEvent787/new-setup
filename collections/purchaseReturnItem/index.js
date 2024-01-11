const mongoose = require("mongoose");

const purchaseReturnItemSchema = new mongoose.Schema({
  vPReturnId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Purchase Return Id",
  },
  vPRId: { type: String, required: true },
  vStockId: { type: String, required: true },
  iReturnQty: { type: Number, default: 0 },
  iOldReturnQty: { type: Number, default: 0 },
  dPurchaseRate: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false },
  vCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Created By" },
  vUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Updated By" },
  dtCreatedAt: Number,
  dtDeletedAt: Number,
  isUpdated: Boolean,
  dtUpdatedAt: Number,
});

module.exports = mongoose.model(
  "tblPurchaseReturnItem",
  purchaseReturnItemSchema
);
