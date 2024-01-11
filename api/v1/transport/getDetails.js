const { Joi } = require("../../../utils/schemaValidate");

const getDetailSchema = Joi.object({
  vTransportId: Joi.string().label("Transport Id").allow(""),
});

module.exports = getDetailSchema;
