const { Joi } = require("../../../utils/schemaValidate");

const getDetailSchema = Joi.object({
  vProductTypeId: Joi.string().label("Product Type Id").allow(""),
});

module.exports = getDetailSchema;
