const { Joi } = require("../../../utils/schemaValidate");

const updateSchema = Joi.object({
  vProductQualityId: Joi.string().required().label("Product Quality Id"),
  vName: Joi.string().required().label("Name").trim(),
  isStatus: Joi.boolean().default(true).label("Status"),
});

module.exports = updateSchema;
