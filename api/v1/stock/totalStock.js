const { Joi } = require("../../../utils/schemaValidate");

const totalStockSchema = Joi.object({
  vProductTypeId: Joi.string().required().label("Product Type Id"),
  vProductQualityId: Joi.string().required().label("Product Quality Id"),
  vProductColorId: Joi.string().required().label("Product Color Id"),
  vProductDenierId: Joi.string().required().label("Product Denier Id"),
  vPackingId: Joi.string().required().label("Packing Id"),
});

module.exports = totalStockSchema;
