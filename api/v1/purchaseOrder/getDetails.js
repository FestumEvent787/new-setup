const { Joi } = require("../../../utils/schemaValidate");

const getDetailSchema = Joi.object({
  vPOrderId: Joi.string().required().label("Purchase Order Id"),
});

module.exports = getDetailSchema;
