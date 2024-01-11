const { Joi } = require("../../../utils/schemaValidate");

const getAllDetailSchema = Joi.object({
  vType: Joi.string().label("Type").allow(""),
});

module.exports = getAllDetailSchema;
