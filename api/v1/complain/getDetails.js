const { Joi } = require("../../../utils/schemaValidate");

const getDetailSchema = Joi.object({
  vComplainId: Joi.string().required().label("Complain Id"),
});

module.exports = getDetailSchema;
