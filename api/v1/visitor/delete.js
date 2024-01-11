const { Joi } = require("../../../utils/schemaValidate");

const deleteSchema = Joi.object({
  vVisitorId: Joi.string().required().label("Visitor Id"),
});

module.exports = deleteSchema;
