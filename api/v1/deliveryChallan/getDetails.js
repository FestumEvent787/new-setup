const { Joi } = require("../../../utils/schemaValidate");

const getDetailSchema = Joi.object({
  vDChallanId: Joi.string().required().label("Delivery Challan Id"),
});

module.exports = getDetailSchema;
