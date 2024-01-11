const { Joi } = require("../../../utils/schemaValidate");

const getDetailsSchema = Joi.object({
  vSettingId: Joi.string().label("Setting Id").allow(""),
});

module.exports = getDetailsSchema;
