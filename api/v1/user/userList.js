const { Joi } = require("../../../utils/schemaValidate");

const userListSchema = Joi.object({
  vSearchText: Joi.string().label("searchText").allow(""),
});

module.exports = userListSchema;
