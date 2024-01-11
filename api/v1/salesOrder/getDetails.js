const { Joi } = require("../../../utils/schemaValidate");

const getDetailSchema = Joi.object({
  vSOrderId: Joi.string().required().label("Sales Order Id"),
});

module.exports = getDetailSchema;
