const mongoose = require("mongoose");

const deliveryChallanItemSchema = new mongoose.Schema({
  vDChallanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Delivery Challan Id",
  },
  vDCId: { type: String, required: true },
  vStockId: { type: String, required: true },
  iDeliverQty: { type: Number, default: 0 },
  dGrsWeight: { type: Number, default: 0 },
  dTareWeight: { type: Number, default: 0 },
  dNetWeight: { type: Number, default: 0 },
  dSalesRate: { type: Number, default: 0 },
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
  "tblDeliveryChallanItem",
  deliveryChallanItemSchema
);
