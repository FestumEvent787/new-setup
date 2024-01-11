const { Joi } = require("../../../utils/schemaValidate");

const updateSchema = Joi.object({
  vVisitorId: Joi.string().required().label("Visitor Id"),
  vEventId: Joi.string().required().label("vEventId").trim(),
  vName: Joi.string().required().label("vName").trim(),
  dtVisit: Joi.string().required().label("dtVisit").trim(),
  vMobile1: Joi.string().required().label("First Mobile").trim(),
  vMobile2: Joi.string().required().label("Second Mobile").trim(),
  vCompanyName: Joi.string().required().label("vCompanyName").trim(),
  vAddress: Joi.string().required().label("vAddress").trim(),
  vCityId: Joi.number().required().label("City Id"),
  objEngagesMachine: Joi.object().label("Engages Machine"),
  objDealingIn: Joi.object().label("Dealing In"),
  vSampleRequire: Joi.string().label("Sample Require").trim().allow(""),
  vRemarks: Joi.string().label("Remarks").trim().allow(""),
  vRepresentedName: Joi.string().label("Represented Name").trim(),
  isStatus: Joi.boolean().default(true).label("Status"),
  arrVisitorUrlImage: Joi.array().label("Visitor Image Array"),
});

module.exports = updateSchema;
