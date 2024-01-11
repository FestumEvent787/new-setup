const { Joi } = require("../../../utils/schemaValidate");

const updateSchema = Joi.object({
  vCustomerId: Joi.string().required().label("Customer Id"),
  vCompanyName: Joi.string().required().label("Company Name").trim(),
  vContactPersonName: Joi.string()
    .required()
    .label("Contact Person Name")
    .trim(),
  vReferenceBy: Joi.string().required().label("Reference By").trim(),
  vMobile: Joi.string().required().label("Mobile").trim(),
  vCityId: Joi.number().required().label("City Id"),
  vGSTNO: Joi.string().label("vGSTNO").trim().allow(""),
  isStatus: Joi.boolean().default(true).label("Status"),
  vCustomerLinkImage: Joi.string().label("Customer Link Image").allow(""),
});

module.exports = updateSchema;
