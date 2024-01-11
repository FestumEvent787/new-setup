const { Joi } = require("../../../utils/schemaValidate");

const getDetailSchema = Joi.object({
  vCustomerId: Joi.string().label("Customer Id").allow(""),
});

module.exports = getDetailSchema;
