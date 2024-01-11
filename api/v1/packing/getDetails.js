const { Joi } = require("../../../utils/schemaValidate");

const getDetailSchema = Joi.object({
  vPackingId: Joi.string().label("Packing Id").allow(""),
});

module.exports = getDetailSchema;
