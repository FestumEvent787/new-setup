const { Joi } = require("../../../utils/schemaValidate");

const updateSchema = Joi.object({
  vPReturnId: Joi.string().required().label("Purchase Return Id"),
  vSupplierId: Joi.string().required().label("Supplier Id"),
  dtBillDate: Joi.string().required().label("Bill Date"),
  dtReturnDate: Joi.string().required().label("Return Date"),
  iBillNumber: Joi.number().required().label("Return Qty"),
  isSelectNote: Joi.boolean().required().label("Select Note"),
  vDebitNote: Joi.string().label("Debit Note").allow(""),
  vCreditNote: Joi.string().label("Credit Note").allow(""),
  vPurchaseReturnLinkImage: Joi.string()
    .label("Purchase Return Link Image")
    .allow(""),
  vNotes: Joi.string().label("Note").allow(""),
  arrPurchaseReturnItem: Joi.array().items(
    Joi.object().keys({
      vStockId: Joi.string().required().label("Stock Id"),
      vProductTypeId: Joi.string().required().label("Product Type Id"),
      vProductQualityId: Joi.string().required().label("Product Quality Id"),
      vProductColorId: Joi.string().required().label("Product Color Id"),
      vProductDenierId: Joi.string().required().label("Product Denier Id"),
      vPackingId: Joi.string().required().label("Packing Id"),
      vNotes: Joi.string().label("Note").allow(""),
      iReturnQty: Joi.number().required().label("Return Qty"),
      iOldReturnQty: Joi.number().required().label("Old Return Qty"),
      dPurchaseRate: Joi.number().required().label("Purchase Rate"),
    })
  ),
});

module.exports = updateSchema;
