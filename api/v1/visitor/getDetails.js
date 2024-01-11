const { Joi } = require("../../../utils/schemaValidate");

const getDetailSchema = Joi.object({
  vVisitorId: Joi.string().label("Visitor Id").allow(""),
});

module.exports = getDetailSchema;
