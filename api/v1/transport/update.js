const { Joi } = require("../../../utils/schemaValidate");

const updateSchema = Joi.object({
  vTransportId: Joi.string().required().label("Transport Id"),
  vCompanyName: Joi.string().required().label("Company Name").trim(),
  vContactPerson: Joi.string().required().label("Contact Person").trim(),
  vReferenceBy: Joi.string().required().label("Reference By").trim(),
  vMobile: Joi.string().required().label("Mobile").trim(),
  vCityId: Joi.number().required().label("City Id"),
  vGSTNO: Joi.string().label("vGSTNO").trim().allow(""),
  isStatus: Joi.boolean().default(true).label("Status"),
  vTransportLinkImage: Joi.string().label("Transport Link Image").allow(""),
});

module.exports = updateSchema;
