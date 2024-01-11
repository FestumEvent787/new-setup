const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const update = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: {
        vSReturnId,
        vCustomerId,
        dtBillDate,
        dtReturnDate,
        iBillNumber,
        iLRNumber,
        iDeliveryChallan,
        vNotes,
        arrSalesReturnItem = [],
      },
    } = entry;

    let condition = {
      _id: new ObjectId(vSReturnId),
      isDeleted: false,
    };

    let salesReturnData = await dbService.findOneRecord(
      "SalesReturnModel",
      condition
    );
    if (!salesReturnData?._id) throw new Error(Message.recordNotFound);

    let updateSalesReturnResponse = await dbService.findOneAndUpdateRecord(
      "SalesReturnModel",
      condition,
      {
        vCustomerId: new ObjectId(vCustomerId),
        dtBillDate: Date.parse(dtBillDate),
        dtReturnDate: Date.parse(dtReturnDate),
        iBillNumber,
        iLRNumber,
        iDeliveryChallan,
        vNotes,
        isUpdated: true,
        dtUpdatedAt: Date.now(),
        vUpdatedBy: new ObjectId(userId),
      },
      {
        returnOriginal: false,
      }
    );
    if (!updateSalesReturnResponse) throw new Error(Message.systemError);

    let where = {
      vSReturnId: new ObjectId(vSReturnId),
      isDeleted: false,
    };
    let salesReturnItemData = await dbService.findAllRecords(
      "SalesReturnItemModel",
      where
    );

    let salesItemId = [];
    salesReturnItemData.forEach((item) => {
      if (item?.vStockId) {
        salesItemId.push({
          salesReturnItemId: item?._id,
          salesReturnStock: item?.vStockId,
        });
      }
    });

    if (arrSalesReturnItem.length > 0) {
      arrSalesReturnItem.forEach((element) => {
        let salesReturnItemObj = {};
        let stockObj = {
          vProductTypeId: new ObjectId(element?.vProductTypeId),
          vProductQualityId: new ObjectId(element?.vProductQualityId),
          vProductColorId: new ObjectId(element?.vProductColorId),
          vProductDenierId: new ObjectId(element?.vProductDenierId),
          vPackingId: new ObjectId(element?.vPackingId),
          vNotes: element?.vNotes ? element?.vNotes : "",
        };
        salesItemId.forEach((data) => {
          if (
            element?.vStockId.toString() == data?.salesReturnStock.toString()
          ) {
            salesReturnItemObj = {
              iReturnQty: element?.iReturnQty,
              iOldReturnQty: element?.iReturnQty,
              dSalesRate: element?.dSalesRate,
              isUpdated: true,
              dtUpdatedAt: Date.now(),
              vUpdatedBy: new ObjectId(userId),
            };

            if (element?.iOldReturnQty > element?.iReturnQty) {
              let total = element?.iOldReturnQty - element?.iReturnQty;
              stockObj = {
                ...stockObj,
                $inc: { iTotalQty: total },
              };
            } else if (element?.iOldReturnQty < element?.iReturnQty) {
              let total = element?.iReturnQty - element?.iOldReturnQty;
              stockObj = {
                ...stockObj,
                $inc: { iTotalQty: -total },
              };
            }

            dbService.findOneAndUpdateRecord(
              "SalesReturnItemModel",
              {
                _id: new ObjectId(data?.salesReturnItemId),
              },
              salesReturnItemObj,
              {
                returnOriginal: false,
              }
            );

            dbService.findOneAndUpdateRecord(
              "StockModel",
              {
                vStockId: element?.vStockId,
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
      _id: salesReturnData?._id,
      vSRId: salesReturnData?.vSRId,
    };

    return result;
  } catch (error) {
    console.error("updateError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = update;
