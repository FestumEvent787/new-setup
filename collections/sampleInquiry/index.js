const mongoose = require("mongoose");

const sampleInquirySchema = new mongoose.Schema({
  vCustomerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  dtInquiryDate: Number,
  vNotes: { type: String, default: "" },
  arrSampleItemDetails: [
    {
      vProductTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product Type",
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
      vPackingId: { type: mongoose.Schema.Types.ObjectId, ref: "Packing" },
      vNotes: { type: String, default: "" },
    },
  ],
  isDeleted: { type: Boolean, default: false },
  vCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Created By" },
  vUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Updated By" },
  dtCreatedAt: Number,
  dtDeletedAt: Number,
  isUpdated: Boolean,
  dtUpdatedAt: Number,
});

module.exports = mongoose.model("tblSampleInquiry", sampleInquirySchema);
