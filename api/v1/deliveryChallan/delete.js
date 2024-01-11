const { Joi } = require("../../../utils/schemaValidate");

const deleteSchema = Joi.object({
  vDChallanId: Joi.string().required().label("Delivery Challan Id"),
});

module.exports = deleteSchema;
