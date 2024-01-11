const { Joi } = require("../../../utils/schemaValidate");

const updateSchema = Joi.object({
  vSOrderId: Joi.string().required().label("Sales Order Id"),
  vCustomerId: Joi.string().required().label("Customer Id"),
  dtOrderDate: Joi.string().required().label("Order Date"),
  dtExpDeliveryDate: Joi.string().required().label("Exp Delivery Date"),
  arrSalesOrderItem: Joi.array().items(
    Joi.object().keys({
      vSalesDetailsId: Joi.string().required().label("Sales Details Id"),
      vProductTypeId: Joi.string().required().label("Product Type Id"),
      vProductQualityId: Joi.string().required().label("Product Quality Id"),
      vProductColorId: Joi.string().required().label("Product Color Id"),
      vProductDenierId: Joi.string().required().label("Product Denier Id"),
      vPackingId: Joi.string().required().label("Packing Id"),
      vNotes: Joi.string().label("Notes").allow(""),
      iSalesQty: Joi.number().required().label("Sales Qty"),
      dSalesRate: Joi.number().required().label("Sales Rate"),
    })
  ),
});

module.exports = updateSchema;
