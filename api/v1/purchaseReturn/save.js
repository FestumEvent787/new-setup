const { Joi } = require("../../../utils/schemaValidate");

const saveSchema = Joi.object({
  vSupplierId: Joi.string().required().label("Supplier Id"),
  dtBillDate: Joi.string().required().label("Bill Date"),
  dtReturnDate: Joi.string().required().label("Return Date"),
  iBillNumber: Joi.number().required().label("Return Qty"),
  isSelectNote: Joi.boolean().required().label("Select Note"),
  vDebitNote: Joi.string().label("Debit Note").allow(""),
  vCreditNote: Joi.string().label("Credit Note").allow(""),
  vNotes: Joi.string().label("Note").allow(""),
  arrPurchaseReturnItem: Joi.array().items(
    Joi.object().keys({
      vProductTypeId: Joi.string().required().label("Product Type Id"),
      vProductQualityId: Joi.string().required().label("Product Quality Id"),
      vProductColorId: Joi.string().required().label("Product Color Id"),
      vProductDenierId: Joi.string().required().label("Product Denier Id"),
      vPackingId: Joi.string().required().label("Packing Id"),
      iReturnQty: Joi.number().required().label("Return Qty"),
      dPurchaseRate: Joi.number().required().label("Purchase Rate"),
      vNotes: Joi.string().label("Notes").allow(""),
    })
  ),
});

module.exports = saveSchema;
