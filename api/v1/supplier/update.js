const { Joi } = require("../../../utils/schemaValidate");

const updateSchema = Joi.object({
  vSupplierId: Joi.string().required().label("Supplier Id"),
  vCompanyName: Joi.string().required().label("Company Name").trim(),
  vContactPersonName: Joi.string()
    .required()
    .label("Contact Person Name")
    .trim(),
  vReferenceBy: Joi.string().required().label("Reference By").trim(),
  vMobile: Joi.string().required().label("Mobile").trim(),
  vEmail: Joi.string().email().required().label("Email").trim(),
  vCityId: Joi.number().required().label("City Id"),
  vGSTNO: Joi.string().label("vGSTNO").trim().allow(""),
  isStatus: Joi.boolean().default(true).label("Status"),
  vSupplierLinkImage: Joi.string().label("Supplier Link Image").allow(""),
});

module.exports = updateSchema;
