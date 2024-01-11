const { Joi } = require("../../../utils/schemaValidate");

const getDetailSchema = Joi.object({
  vPInwardId: Joi.string().label("Purchase Inward Id").allow(""),
});

module.exports = getDetailSchema;
