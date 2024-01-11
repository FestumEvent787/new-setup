const { Joi } = require("../../../utils/schemaValidate");

const deleteSchema = Joi.object({
  vPReturnId: Joi.string().required().label("Purchase Return Id"),
});

module.exports = deleteSchema;
