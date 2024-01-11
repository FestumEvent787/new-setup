const { Joi } = require("../../../utils/schemaValidate");

const getDetailSchema = Joi.object({
  vProductQualityId: Joi.string().label("Product Quality Id").allow(""),
});

module.exports = getDetailSchema;
