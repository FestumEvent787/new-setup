const { Joi } = require("../../../utils/schemaValidate");

const deleteSchema = Joi.object({
  vTransportId: Joi.string().required().label("Transport Id"),
});

module.exports = deleteSchema;
