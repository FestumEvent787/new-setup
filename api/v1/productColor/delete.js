const { Joi } = require("../../../utils/schemaValidate");

const deleteSchema = Joi.object({
  vProductColorId: Joi.string().required().label("Product Color Id"),
});

module.exports = deleteSchema;
