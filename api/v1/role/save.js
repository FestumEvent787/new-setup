const { Joi } = require("../../../utils/schemaValidate");

const saveSchema = Joi.object({
  vName: Joi.string().required().label("Role Name"),
});

module.exports = saveSchema;
