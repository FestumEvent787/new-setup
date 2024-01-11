const { Joi } = require("../../../utils/schemaValidate");

const updateSchema = Joi.object({
  vIndiaMartId: Joi.string().required().label("India Mart Id"),
  vCompanyName: Joi.string().required().label("Company Name").trim(),
  vContactPerson: Joi.string().required().label("Contact Person").trim(),
  vMobile: Joi.string().required().label("Mobile").trim(),
  vAddress: Joi.string().label("Address").trim(),
  vCityId: Joi.number().required().label("City Id"),
  vTraderOrUser: Joi.string().label("Trader Or User").trim().allow(""),
  vRemark: Joi.string().required().label("Remark").trim(),
  arrIndiaMartLinkImage: Joi.array().label("IndiaMart Image Array"),
});

module.exports = updateSchema;
