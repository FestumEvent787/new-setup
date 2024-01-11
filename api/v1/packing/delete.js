const { Joi } = require("../../../utils/schemaValidate");

const deleteSchema = Joi.object({
  vPackingId: Joi.string().required().label("Packing Id"),
});

module.exports = deleteSchema;
