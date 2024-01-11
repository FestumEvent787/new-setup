const { Joi } = require("../../../utils/schemaValidate");

const deleteSchema = Joi.object({
  vSettingId: Joi.string().required().label("Setting Id"),
});

module.exports = deleteSchema;
