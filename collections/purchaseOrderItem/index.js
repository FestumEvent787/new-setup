const mongoose = require("mongoose");

const purchaseOrderItemSchema = new mongoose.Schema({
  vPOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Purchase Order Id",
  },
  vPoId: { type: String, required: true },
  vStockId: { type: String, required: true },
  dPurchaseRate: { type: Number, default: 0 },
  iQty: { type: Number, default: 0 },
  isStatus: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  vCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Created By" },
  vUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Updated By" },
  dtCreatedAt: Number,
  dtDeletedAt: Number,
  isUpdated: Boolean,
  dtUpdatedAt: Number,
});

module.exports = mongoose.model(
  "tblPurchaseOrderItem",
  purchaseOrderItemSchema
);
