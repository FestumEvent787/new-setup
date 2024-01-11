const { Joi } = require("../../../utils/schemaValidate");

const getDetailSchema = Joi.object({
  vSReturnId: Joi.string().label("Sales Return Id").allow(""),
});

module.exports = getDetailSchema;
