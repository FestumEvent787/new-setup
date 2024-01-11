const { Joi } = require("../../../utils/schemaValidate");

const saveSchema = Joi.object({
  vSupplierId: Joi.string().required().label("Supplier Id"),
  dtOrderDate: Joi.string().required().label("Order Date"),
  dtExpDeliveryDate: Joi.string().required().label("Exp Delivery Date"),
  arrPurchaseOrderDetails: Joi.array().items(
    Joi.object().keys({
      vProductTypeId: Joi.string().required().label("Product Type Id"),
      vProductQualityId: Joi.string().required().label("Product Quality Id"),
      vProductColorId: Joi.string().required().label("Product Color Id"),
      vProductDenierId: Joi.string().required().label("Product Denier Id"),
      vPackingId: Joi.string().required().label("Packing Id"),
      vNotes: Joi.string().label("Note").allow(""),
      iQty: Joi.number().required().label("Qty"),
      dPurchaseRate: Joi.number().required().label("Purchase Rate"),
    })
  ),
});

module.exports = saveSchema;
