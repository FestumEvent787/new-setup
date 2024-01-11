const { Joi } = require("../../../utils/schemaValidate");

const deleteSchema = Joi.object({
  vSReturnId: Joi.string().required().label("Sales Return Id"),
});

module.exports = deleteSchema;
