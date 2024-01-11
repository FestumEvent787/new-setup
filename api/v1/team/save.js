const { Joi } = require("../../../utils/schemaValidate");

const saveSchema = Joi.object({
  vName: Joi.string().required().label("Name").trim(),
  vUserRoleId: Joi.string().required().label("User Role Id"),
  vMobile: Joi.string().required().label("Mobile").trim(),
  vAddress: Joi.string().required().label("Address").trim(),
  vCityId: Joi.number().required().label("City Id"),
});

module.exports = saveSchema;
