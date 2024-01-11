const mongoose = require("mongoose");

const deliveryChallanSchema = new mongoose.Schema({
  vSoId: { type: String, required: true },
  vDCId: { type: String, required: true },
  vCustomerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer Id" },
  vPaymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment Id" },
  dtDeliveryChallanDate: Number,
  iChallanNO: Number,
  vChallanImage: { type: String },
  vTransportId: { type: mongoose.Schema.Types.ObjectId, ref: "Transport" },
  vCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Created By" },
  vUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Updated By" },
  isDeleted: { type: Boolean, default: false },
  dtCreatedAt: Number,
  dtDeletedAt: Number,
  isUpdated: Boolean,
  dtUpdatedAt: Number,
});

module.exports = mongoose.model("tblDeliveryChallan", deliveryChallanSchema);
