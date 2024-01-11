const { Joi } = require("../../../utils/schemaValidate");

const deleteSchema = Joi.object({
  vProductQualityId: Joi.string().required().label("Product Quality Id"),
});

module.exports = deleteSchema;
