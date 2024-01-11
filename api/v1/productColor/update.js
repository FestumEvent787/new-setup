const { Joi } = require("../../../utils/schemaValidate");

const updateSchema = Joi.object({
  vProductColorId: Joi.string().required().label("product Color Id"),
  vName: Joi.string().required().label("Name").trim(),
  isStatus: Joi.boolean().default(true).label("Status"),
});

module.exports = updateSchema;
