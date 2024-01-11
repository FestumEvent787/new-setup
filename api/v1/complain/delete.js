const { Joi } = require("../../../utils/schemaValidate");

const deleteSchema = Joi.object({
  vComplainId: Joi.string().required().label("Complain Id"),
});

module.exports = deleteSchema;
