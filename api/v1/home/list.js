const { Joi } = require("../../../utils/schemaValidate");

const listSchema = Joi.object({
  vFilterDate: Joi.string().label("Filter Date").allow(""),
});

module.exports = listSchema;
