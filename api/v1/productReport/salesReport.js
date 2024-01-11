const { Joi } = require("../../../utils/schemaValidate");

const salesReportSchema = Joi.object({
  vStartDate: Joi.string().label("Start Date").allow(""),
  vEndDate: Joi.string().label("End Date").allow(""),
  vCustomerId: Joi.string().label("Customer Id").allow(""),
});

module.exports = salesReportSchema;
