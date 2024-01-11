const { Joi } = require("../../../utils/schemaValidate");

const getDetailSchema = Joi.object({
  vProductColorId: Joi.string().label("Product Color Id").allow(""),
});

module.exports = getDetailSchema;
