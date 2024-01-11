const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const update = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: {
        vSOrderId,
        vCustomerId,
        dtOrderDate,
        dtExpDeliveryDate,
        arrSalesOrderItem = [],
      },
    } = entry;

    let condition = {
      _id: new ObjectId(vSOrderId),
      isDeleted: false,
    };

    let salesOrderData = await dbService.findOneRecord(
      "SalesOrderModel",
      condition,
      {
        _id: 1,
      }
    );
    if (!salesOrderData?._id) throw new Error(Message.recordNotFound);

    let updateSalesOrderResponse = await dbService.findOneAndUpdateRecord(
      "SalesOrderModel",
      condition,
      {
        vCustomerId: new ObjectId(vCustomerId),
        dtOrderDate: Date.parse(dtOrderDate),
        dtExpDeliveryDate: Date.parse(dtExpDeliveryDate),
        isUpdated: true,
        dtUpdatedAt: Date.now(),
        vUpdatedBy: new ObjectId(userId),
      },
      {
        returnOriginal: false,
      }
    );
    if (!updateSalesOrderResponse) throw new Error(Message.systemError);

    let where = {
      vSOrderId: new ObjectId(vSOrderId),
      isDeleted: false,
    };
    let salesOrderItemData = await dbService.findAllRecords(
      "SalesOrderItemModel",
      where
    );

    let salesItemId = [];
    salesOrderItemData.forEach((item) => {
      if (item?.vStockId) {
        salesItemId.push({
          salesOrderItemId: item?._id,
          salesOrderStock: item?.vStockId,
        });
      }
    });

    if (arrSalesOrderItem.length > 0) {
      arrSalesOrderItem.forEach((element) => {
        salesItemId.forEach((data) => {
          let salesOrderItemObj = {};
          let stockObj = {};
          if (
            element?.vSalesDetailsId.toString() ==
            data?.salesOrderItemId.toString()
          ) {
            salesOrderItemObj = {
              iSalesQty: element?.iSalesQty,
              dSalesRate: element?.dSalesRate,
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
              dSalesRate: element?.dSalesRate,
              isUpdated: true,
              dtUpdatedAt: Date.now(),
              vUpdatedBy: new ObjectId(userId),
            };

            dbService.findOneAndUpdateRecord(
              "SalesOrderItemModel",
              {
                _id: new ObjectId(data?.salesOrderItemId),
              },
              salesOrderItemObj,
              {
                returnOriginal: false,
              }
            );

            dbService.findOneAndUpdateRecord(
              "StockModel",
              {
                vStockId: data?.salesOrderStock,
              },
              stockObj,
              {
                returnOriginal: false,
              }
            );
          }
        });
      });
    }

    const result = {
      _id: updateSalesOrderResponse?._id,
      vSoId: updateSalesOrderResponse?.vSoId,
      isComplete: updateSalesOrderResponse?.isComplete,
    };

    return result;
  } catch (error) {
    console.error("updateError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = update;
