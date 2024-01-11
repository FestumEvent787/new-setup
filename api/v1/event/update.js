const { Joi } = require("../../../utils/schemaValidate");

const updateSchema = Joi.object({
  vEventId: Joi.string().required().label("Event Id"),
  vTitle: Joi.string().required().label("Title").trim(),
  dtStart: Joi.string().required().label("dtStart").trim(),
  dtEnd: Joi.string().required().label("dtEnd").trim(),
  vAddress: Joi.string().required().label("Address").trim(),
  vCityId: Joi.number().required().label("City Id"),
  isStatus: Joi.boolean().default(true).label("Status"),
  vEventLinkImage: Joi.string().label("Event Link Image").allow(""),
});

module.exports = updateSchema;
