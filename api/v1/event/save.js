const { Joi } = require("../../../utils/schemaValidate");

const saveSchema = Joi.object({
  vTitle: Joi.string().required().label("Title").trim(),
  dtStart: Joi.string().required().label("Start").trim(),
  dtEnd: Joi.string().required().label("End").trim(),
  vAddress: Joi.string().required().label("Address").trim(),
  vCityId: Joi.number().required().label("City Id"),
});

module.exports = saveSchema;
