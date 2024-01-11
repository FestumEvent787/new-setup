const { Joi } = require("../../../utils/schemaValidate");

const deleteSchema = Joi.object({
  vPOrderId: Joi.string().required().label("Purchase Order Id"),
});

module.exports = deleteSchema;
