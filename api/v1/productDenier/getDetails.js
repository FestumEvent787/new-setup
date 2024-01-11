const { Joi } = require("../../../utils/schemaValidate");

const getDetailSchema = Joi.object({
  vProductDenierId: Joi.string().label("Product Denier Id").allow(""),
});

module.exports = getDetailSchema;
