const { Joi } = require("../../../utils/schemaValidate");

const stockReportSchema = Joi.object({
  vStartDate: Joi.string().required().label("Start Date"),
  vEndDate: Joi.string().required().label("End Date"),
  vProductTypeId: Joi.string().required().label("Product Type Id"),
  vProductQualityId: Joi.string().required().label("Product Quality Id"),
  vProductColorId: Joi.string().required().label("Product Color Id"),
  vProductDenierId: Joi.string().required().label("Product Denier Id"),
  vPackingId: Joi.string().required().label("Packing Id"),
});

module.exports = stockReportSchema;
