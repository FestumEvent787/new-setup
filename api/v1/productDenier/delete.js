const { Joi } = require("../../../utils/schemaValidate");

const deleteSchema = Joi.object({
  vProductDenierId: Joi.string().required().label("Product Denier Id"),
});

module.exports = deleteSchema;
