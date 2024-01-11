const { Joi } = require("../../../utils/schemaValidate");

const updateSchema = Joi.object({
  vPOrderId: Joi.string().required().label("Purchase Order Id"),
  vSupplierId: Joi.string().label("Supplier Id").allow(""),
  dtOrderDate: Joi.string().label("Order Date").allow(""),
  dtExpDeliveryDate: Joi.string().label("Exp Delivery Date").allow(""),
  arrPurchaseOrderDetails: Joi.array().items(
    Joi.object().keys({
      vPurchaseDetailsId: Joi.string().required().label("Purchase Details Id"),
      vProductTypeId: Joi.string().required().label("Product Type Id"),
      vProductQualityId: Joi.string().required().label("Product Quality Id"),
      vProductColorId: Joi.string().required().label("Product Color Id"),
      vProductDenierId: Joi.string().required().label("Product Denier Id"),
      vPackingId: Joi.string().required().label("Packing Id"),
      vNotes: Joi.string().label("Note").allow(""),
      iQty: Joi.number().label("Qty").allow(""),
      dPurchaseRate: Joi.number().label("Purchase Rate").allow(""),
    })
  ),
});

module.exports = updateSchema;
