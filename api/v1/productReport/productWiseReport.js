const { Joi } = require("../../../utils/schemaValidate");

const productWiseReportSchema = Joi.object({
  vStartDate: Joi.string().required().label("Start Date"),
  vEndDate: Joi.string().required().label("End Date"),
  vProductTypeId: Joi.string().label("Product Type Id").allow(""),
  vProductQualityId: Joi.string().label("Product Quality Id").allow(""),
  vProductColorId: Joi.string().label("Product Color Id").allow(""),
  vProductDenierId: Joi.string().label("Product Denier Id").allow(""),
  vPackingId: Joi.string().label("Packing Id").allow(""),
});

module.exports = productWiseReportSchema;
