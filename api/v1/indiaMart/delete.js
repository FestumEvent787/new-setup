const { Joi } = require("../../../utils/schemaValidate");

const deleteSchema = Joi.object({
  vIndiaMartId: Joi.string().required().label("India Mart Id"),
});

module.exports = deleteSchema;
