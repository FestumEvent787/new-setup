const { Joi } = require("../../../utils/schemaValidate");

const getDetailSchema = Joi.object({
  vSupplierId: Joi.string().label("Supplier Id").allow(""),
});

module.exports = getDetailSchema;
