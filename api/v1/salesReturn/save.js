const { Joi } = require("../../../utils/schemaValidate");

const saveSchema = Joi.object({
  vCustomerId: Joi.string().required().label("Customer Id"),
  iDeliveryChallan: Joi.string().required().label("Delivery Challan"),
  dtBillDate: Joi.string().required().label("Bill Date"),
  dtReturnDate: Joi.string().required().label("Return Date"),
  iBillNumber: Joi.number().required().label("Bill Number"),
  iLRNumber: Joi.number().required().label("LR Number"),
  vNotes: Joi.string().label("Notes").allow(""),
  arrSalesReturnItem: Joi.array().items(
    Joi.object().keys({
      vProductTypeId: Joi.string().required().label("Product Type Id"),
      vProductQualityId: Joi.string().required().label("Product Quality Id"),
      vProductColorId: Joi.string().required().label("Product Color Id"),
      vProductDenierId: Joi.string().required().label("Product Denier Id"),
      vPackingId: Joi.string().required().label("Packing Id"),
      vNotes: Joi.string().label("Notes").allow(""),
      iReturnQty: Joi.number().required().label("Return Qty"),
      dSalesRate: Joi.number().required().label("Sales Rate"),
    })
  ),
});

module.exports = saveSchema;
