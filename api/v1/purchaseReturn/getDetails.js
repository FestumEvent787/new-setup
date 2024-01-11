const { Joi } = require("../../../utils/schemaValidate");

const getDetailSchema = Joi.object({
  vPReturnId: Joi.string().label("Purchase Return Id").allow(""),
});

module.exports = getDetailSchema;
