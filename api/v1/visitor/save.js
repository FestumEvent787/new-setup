const { Joi } = require("../../../utils/schemaValidate");

const saveSchema = Joi.object({
  vEventId: Joi.string().required().label("Event Id").trim(),
  vName: Joi.string().required().label("Name").trim(),
  dtVisit: Joi.string().required().label("Visit Date").trim(),
  vMobile1: Joi.string().required().label("First Mobile").trim(),
  vMobile2: Joi.string().required().label("Second Mobile").trim(),
  vCompanyName: Joi.string().required().label("CompanyName").trim(),
  vAddress: Joi.string().required().label("Address").trim(),
  vCityId: Joi.number().required().label("City Id"),
  objEngagesMachine: Joi.object().label("Engages Machine"),
  objDealingIn: Joi.object().label("Dealing In"),
  vSampleRequire: Joi.string().label("Sample Require").trim().allow(""),
  vRemarks: Joi.string().label("Remarks").trim().allow(""),
  vRepresentedName: Joi.string().label("Represented Name").trim(),
});

module.exports = saveSchema;
