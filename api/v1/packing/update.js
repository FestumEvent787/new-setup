const { Joi } = require("../../../utils/schemaValidate");

const updateSchema = Joi.object({
  vPackingId: Joi.string().required().label("Packing Id"),
  vName: Joi.string().required().label("Name").trim(),
  isStatus: Joi.boolean().default(true).label("Status"),
});

module.exports = updateSchema;
