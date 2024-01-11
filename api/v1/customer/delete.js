const { Joi } = require("../../../utils/schemaValidate");

const deleteSchema = Joi.object({
  vCustomerId: Joi.string().required().label("Customer Id"),
});

module.exports = deleteSchema;
