const { Joi } = require("../../../utils/schemaValidate");

const deleteSchema = Joi.object({
  vTeamId: Joi.string().required().label("Team Id"),
});

module.exports = deleteSchema;
