const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
  vEventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  vName: { type: String },
  vCompanyName: { type: String },
  vMobile1: { type: String },
  vMobile2: { type: String },
  vAddress: { type: String },
  vCityId: { type: String },
  objEngagesMachine: {
    isEmbroidery: { type: Boolean, default: false },
    isRapierJacquard: { type: Boolean, default: false },
    isPowerLoom: { type: Boolean, default: false },
    isWaterJet: { type: Boolean, default: false },
    isAirJet: { type: Boolean, default: false },
    isKnittingMachine: { type: Boolean, default: false },
    isSchiffli: { type: Boolean, default: false },
    isCrochet: { type: Boolean, default: false },
    isRapierLoom: { type: Boolean, default: false },
    isHandloom: { type: Boolean, default: false },
    isNeedlesLooms: { type: Boolean, default: false },
    vOthers: { type: String, default: "" },
  },
  objDealingIn: {
    objPolyesterZari: {
      isDealing: { type: Boolean, default: false },
      vText: { type: String, default: "" },
    },
    objNylonZari: {
      isDealing: { type: Boolean, default: false },
      vText: { type: String, default: "" },
    },
    objMxBadla: {
      isDealing: { type: Boolean, default: false },
      vText: { type: String, default: "" },
    },
    objChapatZari: {
      isDealing: { type: Boolean, default: false },
      vText: { type: String, default: "" },
    },
    objBanarasiZari: {
      isDealing: { type: Boolean, default: false },
      vText: { type: String, default: "" },
    },
    objSpSparkleZari: {
      isDealing: { type: Boolean, default: false },
      vText: { type: String, default: "" },
    },
    objSpNeem: {
      isDealing: { type: Boolean, default: false },
      vText: { type: String, default: "" },
    },
  },
  vSampleRequire: { type: String },
  vRemarks: { type: String },
  vRepresentedName: { type: String },
  arrVisitingCardImage: [],
  isStatus: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  vCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Created By" },
  vUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Updated By" },
  dtVisit: Number,
  dtStart: Number,
  dtEnd: Number,
  dtCreatedAt: Number,
  dtDeletedAt: Number,
  isUpdated: Boolean,
  dtUpdatedAt: Number,
});

module.exports = mongoose.model("tblVisitor", visitorSchema);
