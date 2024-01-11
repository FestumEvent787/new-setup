const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  vStockId: { type: String, required: true },
  vProductTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product Type Id",
  },
  vProductQualityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product Color",
  },
  vProductColorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product Color",
  },
  vProductDenierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product Denier",
  },
  vPackingId: { type: mongoose.Schema.Types.ObjectId, ref: "Packing Id" },
  vNotes: { type: String, default: "" },
  dPurchaseRate: { type: Number, default: 0 },
  dSalesRate: { type: Number, default: 0 },
  iTotalQty: { type: Number, default: 0 },
  isStatus: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  vCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Created By" },
  vUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Updated By" },
  dtCreatedAt: Number,
  dtDeletedAt: Number,
  isUpdated: Boolean,
  dtUpdatedAt: Number,
});

module.exports = mongoose.model("tblStock", stockSchema);
