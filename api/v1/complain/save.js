const { Joi } = require("../../../utils/schemaValidate");

const saveSchema = Joi.object({
  vCustomerId: Joi.string().required().label("Customer Id"),
  dtComplainDate: Joi.string().required().label("Complain Date"),
  dtInvoiceDate: Joi.string().required().label("Invoice Date"),
  vMobile: Joi.string().required().label("Mobile"),
  vComplainNote: Joi.string().label("Complain Notes").allow(""),
});

module.exports = saveSchema;
