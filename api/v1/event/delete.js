const { Joi } = require("../../../utils/schemaValidate");

const deleteSchema = Joi.object({
  vEventId: Joi.string().required().label("Event Id"),
});

module.exports = deleteSchema;
