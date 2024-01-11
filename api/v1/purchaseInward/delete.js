const { Joi } = require("../../../utils/schemaValidate");

const deleteSchema = Joi.object({
  vPInwardId: Joi.string().required().label("Purchase Inward Id"),
});

module.exports = deleteSchema;
