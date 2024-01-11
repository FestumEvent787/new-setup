const { Joi } = require("../../../utils/schemaValidate");

const saveSchema = Joi.object({
  isPaymentReminder: Joi.boolean().default(true).label("Payment Reminder"),
  vGSTNO: Joi.string().required().label("GST NO").trim(),
  vImportanceNotes: Joi.string().required().label("Importance Notes").trim(),
  vWhatsAppAPIkey: Joi.string().required().label("WhatsApp API key").trim(),
});

module.exports = saveSchema;
