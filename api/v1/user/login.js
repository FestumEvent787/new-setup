const { Joi } = require("../../../utils/schemaValidate");

const loginSchema = Joi.object({
  vMobile: Joi.string().required().label("Mobile"),
});

module.exports = loginSchema;
