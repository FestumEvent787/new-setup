const { Joi } = require("../../../utils/schemaValidate");

const deleteSchema = Joi.object({
  vSupplierId: Joi.string().required().label("Supplier Id"),
});
module.exports = deleteSchema;
