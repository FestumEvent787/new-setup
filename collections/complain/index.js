const mongoose = require("mongoose");

const complainSchema = new mongoose.Schema({
  vCustomerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  dtComplainDate: Number,
  dtInvoiceDate: Number,
  vMobile: { type: String },
  vComplainNote: { type: String, default: "" },
  vComplainReview: { type: String, default: "" },
  arrComplainPhotos: [],
  isComplainStatus: { type: Number, default: 1 }, // 0 - Cancelled, 1 - Pending, 2 - Completed
  isDeleted: { type: Boolean, default: false },
  vCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Created By" },
  vUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Updated By" },
  dtCreatedAt: Number,
  dtDeletedAt: Number,
  isUpdated: Boolean,
  dtUpdatedAt: Number,
});

module.exports = mongoose.model("tblComplain", complainSchema);
