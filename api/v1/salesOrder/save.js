const { Joi } = require("../../../utils/schemaValidate");

const saveSchema = Joi.object({
  vCustomerId: Joi.string().required().label("Customer Id"),
  dtOrderDate: Joi.string().required().label("Order Date"),
  dtExpDeliveryDate: Joi.string().required().label("Exp Delivery Date"),
  arrSalesOrderItem: Joi.array().items(
    Joi.object().keys({
      vProductTypeId: Joi.string().required().label("Product Type Id"),
      vProductQualityId: Joi.string().required().label("Product Quality Id"),
      vProductColorId: Joi.string().required().label("Product Color Id"),
      vProductDenierId: Joi.string().required().label("Product Denier Id"),
      vPackingId: Joi.string().required().label("Packing Id"),
      iSalesQty: Joi.number().required().label("Sales Qty"),
      dSalesRate: Joi.number().required().label("Sales Rate"),
      vNotes: Joi.string().label("Notes").allow(""),
    })
  ),
});

module.exports = saveSchema;
