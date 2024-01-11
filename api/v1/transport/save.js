const { Joi } = require("../../../utils/schemaValidate");

const saveSchema = Joi.object({
  vCompanyName: Joi.string().required().label("Company Name").trim(),
  vContactPerson: Joi.string().required().label("Contact Person").trim(),
  vReferenceBy: Joi.string().required().label("Reference By").trim(),
  vMobile: Joi.string().required().label("Mobile").trim(),
  vCityId: Joi.number().required().label("City Id"),
  vGSTNO: Joi.string().label("vGSTNO").trim().allow(""),
});

module.exports = saveSchema;
