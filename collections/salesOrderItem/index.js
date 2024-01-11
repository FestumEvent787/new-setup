const mongoose = require("mongoose");

const salesOrderItemSchema = new mongoose.Schema({
  vSOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sales Order Id",
  },
  vSoId: { type: String, required: true },
  vStockId: { type: String, required: true },
  iSalesQty: { type: Number, default: 0 },
  dSalesRate: { type: Number, default: 0 },
  iTotalSalesCount: { type: Number, default: 0 },
  isStatus: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  vCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Created By" },
  vUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Updated By" },
  dtCreatedAt: Number,
  dtDeletedAt: Number,
  isUpdated: Boolean,
  dtUpdatedAt: Number,
});

module.exports = mongoose.model("tblSalesOrderItem", salesOrderItemSchema);
