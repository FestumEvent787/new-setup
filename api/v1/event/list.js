const { Joi } = require("../../../utils/schemaValidate");

const listSchema = Joi.object({
  vEventType: Joi.string().label("Event Type").allow(""),
  vEventTitle: Joi.string().label("Event Title").allow(""),
  vEventStartDate: Joi.string().label("Event Start Date").allow(""),
  vEventEndDate: Joi.string().label("Event End Date").allow(""),
});

module.exports = listSchema;
