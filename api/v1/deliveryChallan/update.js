const { Joi } = require("../../../utils/schemaValidate");

const updateSchema = Joi.object({
  vDChallanId: Joi.string().required().label("Delivery Challan Id"),
  vCustomerId: Joi.string().required().label("Customer Id"),
  vTransportId: Joi.string().required().label("Transport Id"),
  dtDeliveryChallanDate: Joi.string().required().label("Delivery Challan Date"),
  iChallanNO: Joi.number().required().label("Challan Number"),
  vChallanLinkImage: Joi.string().label("Challan Link Image").allow(""),
  arrDeliveryChallanItem: Joi.array().items(
    Joi.object().keys({
      vStockId: Joi.string().required().label("Stock Id"),
      vProductTypeId: Joi.string().required().label("Product Type Id"),
      vProductQualityId: Joi.string().required().label("Product Quality Id"),
      vProductColorId: Joi.string().required().label("Product Color Id"),
      vProductDenierId: Joi.string().required().label("Product Denier Id"),
      vPackingId: Joi.string().required().label("Packing Id"),
      vNotes: Joi.string().label("Note").allow(""),
      iDeliverQty: Joi.number().required().label("Deliver Qty"),
      dSalesRate: Joi.number().required().label("Sales Rate"),
      dGrsWeight: Joi.number().required().label("Grs Weight"),
      dTareWeight: Joi.number().required().label("Tare Weight"),
      dNetWeight: Joi.number().required().label("Net Weight"),
    })
  ),
});

module.exports = updateSchema;
