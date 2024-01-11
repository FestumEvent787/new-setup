const { Joi } = require("../../../utils/schemaValidate");

const updateSchema = Joi.object({
  vSampleInquiryId: Joi.string().required().label("Sample Inquiry Id"),
  vCustomerId: Joi.string().required().label("Customer Id"),
  dtInquiryDate: Joi.string().required().label("Inquiry Date"),
  vNotes: Joi.string().label("Notes").allow(""),
  arrSampleItemDetails: Joi.array().items(
    Joi.object().keys({
      vProductTypeId: Joi.string().required().label("Product Type Id"),
      vProductQualityId: Joi.string().required().label("Product Quality Id"),
      vProductColorId: Joi.string().required().label("Product Color Id"),
      vProductDenierId: Joi.string().required().label("Product Denier Id"),
      vPackingId: Joi.string().required().label("Packing Id"),
      vNotes: Joi.string().label("Notes").allow(""),
    })
  ),
});

module.exports = updateSchema;
