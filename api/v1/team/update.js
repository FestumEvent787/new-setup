const { Joi } = require("../../../utils/schemaValidate");

const updateSchema = Joi.object({
  vName: Joi.string().required().label("Name").trim(),
  vAddress: Joi.string().required().label("Address").trim(),
  vCityId: Joi.number().required().label("City Id"),
  isStatus: Joi.boolean().default(true).label("Status"),
  vTeamLinkImage: Joi.string().label("Team Link Image").allow(""),
});

module.exports = updateSchema;
