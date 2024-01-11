const { Joi } = require("../../../utils/schemaValidate");

const deleteSchema = Joi.object({
  vProductTypeId: Joi.string().required().label("Product Type Id"),
});

module.exports = deleteSchema;
