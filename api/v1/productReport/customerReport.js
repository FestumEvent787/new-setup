const { Joi } = require("../../../utils/schemaValidate");

const customerReportSchema = Joi.object({
  vCustomerId: Joi.string().label("Customer Id").allow(""),
});

module.exports = customerReportSchema;
