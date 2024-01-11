const { Joi } = require("../../../utils/schemaValidate");

const deleteSchema = Joi.object({
  vSOrderId: Joi.string().required().label("Sales Order Id"),
});

module.exports = deleteSchema;
