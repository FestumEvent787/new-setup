const { Joi } = require("../../../utils/schemaValidate");

const getDetailSchema = Joi.object({
  vIndiaMartId: Joi.string().label("India Mart Id").allow(""),
});

module.exports = getDetailSchema;
