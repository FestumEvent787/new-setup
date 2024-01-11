const { Joi } = require("../../../utils/schemaValidate");

const updateSchema = Joi.object({
  vProductTypeId: Joi.string().required().label("product Type Id"),
  vName: Joi.string().required().label("Name").trim(),
  isStatus: Joi.boolean().default(true).label("Status"),
});

module.exports = updateSchema;
