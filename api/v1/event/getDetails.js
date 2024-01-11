const { Joi } = require("../../../utils/schemaValidate");

const getDetailSchema = Joi.object({
  vEventId: Joi.string().required().label("Event Id"),
});

module.exports = getDetailSchema;
