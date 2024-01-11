const { Joi } = require("../../../utils/schemaValidate");

const updateSchema = Joi.object({
  vComplainId: Joi.string().required().label("Complain Id"),
  vCustomerId: Joi.string().required().label("Customer Id"),
  dtComplainDate: Joi.string().required().label("Complain Date"),
  dtInvoiceDate: Joi.string().required().label("Invoice Date"),
  vMobile: Joi.string().required().label("Mobile"),
  vComplainReview: Joi.string().label("Complain Review").allow(""),
  isComplainStatus: Joi.number().default(1).label("Complain Status"),
  arrComplainUrlImage: Joi.array().label("Complain Image Array"),
});

module.exports = updateSchema;
