const mongoose = require("mongoose");

const salesOrderSchema = new mongoose.Schema({
  vSoId: { type: String, required: true },
  vCustomerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer Id" },
  vPaymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment Id" },
  dtOrderDate: Number,
  dtExpDeliveryDate: Number,
  vCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Created By" },
  vUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Updated By" },
  isComplete: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  dtCreatedAt: Number,
  dtDeletedAt: Number,
  isUpdated: Boolean,
  dtUpdatedAt: Number,
});

module.exports = mongoose.model("tblSalesOrder", salesOrderSchema);
