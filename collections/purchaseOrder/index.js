const mongoose = require("mongoose");

const purchaseOrderSchema = new mongoose.Schema({
  vPoId: { type: String, required: true },
  vSupplierId: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier Id" },
  dtOrderDate: Number,
  dtExpDeliveryDate: Number,
  isComplete: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  vCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Created By" },
  vUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Updated By" },
  dtCreatedAt: Number,
  dtDeletedAt: Number,
  isUpdated: Boolean,
  dtUpdatedAt: Number,
});

module.exports = mongoose.model("tblPurchaseOrder", purchaseOrderSchema);
