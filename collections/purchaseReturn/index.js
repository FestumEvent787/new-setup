const mongoose = require("mongoose");

const purchaseReturnSchema = new mongoose.Schema({
  vPRId: { type: String, required: true },
  vSupplierId: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier Id" },
  dtBillDate: Number,
  dtReturnDate: Number,
  iBillNumber: { type: Number, default: 0 },
  vDebitNote: { type: String, default: "" },
  vCreditNote: { type: String, default: "" },
  vDebitImage: { type: String },
  vCreditImage: { type: String },
  vNotes: { type: String, default: "" },
  isSelectNote: { type: Boolean, default: false }, // debit: false, credit: true
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

module.exports = mongoose.model("tblPurchaseReturn", purchaseReturnSchema);
