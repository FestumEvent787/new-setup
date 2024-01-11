const { Joi } = require("../../../utils/schemaValidate");

const updateSchema = Joi.object({
  vProductDenierId: Joi.string().required().label("product Denier Id"),
  vName: Joi.string().required().label("Name").trim(),
  isStatus: Joi.boolean().default(true).label("Status"),
});

module.exports = updateSchema;
