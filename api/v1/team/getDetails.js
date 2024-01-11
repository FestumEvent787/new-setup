const { Joi } = require("../../../utils/schemaValidate");

const getDetailSchema = Joi.object({
  vTeamId: Joi.string().required().label("Team Id"),
});

module.exports = getDetailSchema;
