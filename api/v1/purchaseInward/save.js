const { Joi } = require("../../../utils/schemaValidate");

const saveSchema = Joi.object({
  vPoId: Joi.string().required().label("Purchase Order Id"),
  vTransportationName: Joi.string().required().label("Transportation Name"),
  dtChallanDate: Joi.string().required().label("Challan Date"),
  iChallanNO: Joi.number().required().label("Challan NO"),
  iLRNO: Joi.number().label("LR NO").allow(""),
  iInvoiceNo: Joi.number().label("Invoice NO").allow(""),
  iEWayBill: Joi.number().label("E-Way Bill").allow(""),
  vNotes: Joi.string().label("Note").allow(""),
  arrPurchaseInwardItem: Joi.array().items(
    Joi.object().keys({
      vProductTypeId: Joi.string().required().label("Product Type Id"),
      vProductQualityId: Joi.string().required().label("Product Quality Id"),
      vProductColorId: Joi.string().required().label("Product Color Id"),
      vProductDenierId: Joi.string().required().label("Product Denier Id"),
      vPackingId: Joi.string().required().label("Packing Id"),
      vNotes: Joi.string().label("Note").allow(""),
      iReceiveQty: Joi.number().required().label("Receive Qty"),
      dPurchaseRate: Joi.number().required().label("Purchase Rate"),
    })
  ),
});

module.exports = saveSchema;
