const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const update = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: {
        vPOrderId,
        vSupplierId,
        dtOrderDate,
        dtExpDeliveryDate,
        arrPurchaseOrderDetails = [],
      },
    } = entry;

    let condition = {
      _id: new ObjectId(vPOrderId),
      isDeleted: false,
    };

    let purchaseOrderData = await dbService.findOneRecord(
      "PurchaseOrderModel",
      condition,
      {
        _id: 1,
      }
    );
    if (!purchaseOrderData?._id) throw new Error(Message.recordNotFound);

    let updatePurchaseOrderResponse = await dbService.findOneAndUpdateRecord(
      "PurchaseOrderModel",
      condition,
      {
        dtOrderDate: Date.parse(dtOrderDate),
        dtExpDeliveryDate: Date.parse(dtExpDeliveryDate),
        vSupplierId: new ObjectId(vSupplierId),
        isUpdated: true,
        dtUpdatedAt: Date.now(),
        vUpdatedBy: new ObjectId(userId),
      },
      {
        returnOriginal: false,
      }
    );
    if (!updatePurchaseOrderResponse) throw new Error(Message.systemError);

    let where = {
      vPOrderId: new ObjectId(vPOrderId),
      isDeleted: false,
    };
    let purchaseDetailsData = await dbService.findAllRecords(
      "PurchaseOrderItemModel",
      where
    );

    let purchaseDetailsId = [];
    purchaseDetailsData.forEach((item) => {
      if (item?._id) {
        purchaseDetailsId.push({
          purchaseDetailsOrderId: item?._id,
          purchaseDetailsStock: item?.vStockId,
        });
      }
    });

    if (arrPurchaseOrderDetails.length > 0) {
      arrPurchaseOrderDetails.forEach((element) => {
        purchaseDetailsId.forEach((item) => {
          let purchaseOrderDetailsObj = {};
          let stockObj = {};
          if (
            element?.vPurchaseDetailsId.toString() ==
            item?.purchaseDetailsOrderId.toString()
          ) {
            purchaseOrderDetailsObj = {
              dPurchaseRate: element?.dPurchaseRate,
              iQty: element?.iQty,
              isUpdated: true,
              dtUpdatedAt: Date.now(),
              vUpdatedBy: new ObjectId(userId),
            };
            stockObj = {
              vProductTypeId: new ObjectId(element?.vProductTypeId),
              vProductQualityId: new ObjectId(element?.vProductQualityId),
              vProductColorId: new ObjectId(element?.vProductColorId),
              vProductDenierId: new ObjectId(element?.vProductDenierId),
              vPackingId: new ObjectId(element?.vPackingId),
              vNotes: element?.vNotes ? element?.vNotes : "",
              dPurchaseRate: element?.dPurchaseRate,
              isUpdated: true,
              dtUpdatedAt: Date.now(),
              vUpdatedBy: new ObjectId(userId),
            };
          }

          dbService.findOneAndUpdateRecord(
            "PurchaseOrderItemModel",
            {
              _id: new ObjectId(item?.purchaseDetailsOrderId),
            },
            purchaseOrderDetailsObj,
            {
              returnOriginal: false,
            }
          );

          dbService.findOneAndUpdateRecord(
            "StockModel",
            {
              vStockId: item?.purchaseDetailsStock,
            },
            stockObj,
            {
              returnOriginal: false,
            }
          );
        });
      });
    }

    let purchaseOrder = {
      _id: updatePurchaseOrderResponse?._id,
      vPoId: updatePurchaseOrderResponse?.vPoId,
      isComplete: updatePurchaseOrderResponse?.isComplete,
    };

    return purchaseOrder;
  } catch (error) {
    console.error("updateError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = update;
