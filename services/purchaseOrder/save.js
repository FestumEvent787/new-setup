const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");
const moment = require("moment");

const save = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: {
        vSupplierId,
        dtOrderDate,
        dtExpDeliveryDate,
        arrPurchaseOrderDetails = [],
      },
    } = entry;

    let todayDate = moment().format("YYYYMMDD");
    let currentDate = moment().format("YYYY-MM-DD");

    const purchaseOrderCount = await dbService.recordsCount(
      "PurchaseOrderModel",
      {
        isDeleted: false,
        dtCreatedAt: { $gte: Date.parse(currentDate) },
      }
    );

    let totalData = purchaseOrderCount + 1;
    let formattedNumber = totalData.toString().padStart(3, "0");
    const purchaseOrderNumber = "P" + todayDate.concat(formattedNumber);

    const stockCount = await dbService.recordsCount("StockModel", {
      isDeleted: false,
    });

    let purchaseSave = {
      vPoId: purchaseOrderNumber,
      dtOrderDate: Date.parse(dtOrderDate),
      dtExpDeliveryDate: Date.parse(dtExpDeliveryDate),
      vSupplierId: new ObjectId(vSupplierId),
      vCreatedBy: new ObjectId(userId),
      dtCreatedAt: Date.now(),
    };

    const savePurchaseOrderData = await dbService.createOneRecord(
      "PurchaseOrderModel",
      purchaseSave
    );
    if (!savePurchaseOrderData) throw new Error(Message.systemError);

    let stockData = await dbService.findAllRecords("StockModel", {
      isDeleted: false,
    });

    let stockArray = [];
    let purchaseDetailsArray = [];
    let stockAvailable = false;
    if (arrPurchaseOrderDetails.length > 0) {
      let addCount = 1;
      let stockId = "";
      arrPurchaseOrderDetails.forEach(async (element) => {
        if (stockData?.length > 0) {
          const matchingStockItem = stockData.find((stockItem) => {
            return (
              stockItem.vProductTypeId.toString() ===
                element.vProductTypeId.toString() &&
              stockItem.vProductQualityId.toString() ===
                element.vProductQualityId.toString() &&
              stockItem.vProductColorId.toString() ===
                element.vProductColorId.toString() &&
              stockItem.vProductDenierId.toString() ===
                element.vProductDenierId.toString() &&
              stockItem.vPackingId.toString() === element.vPackingId.toString()
            );
          });
          if (matchingStockItem) {
            stockAvailable = true;
            stockId = matchingStockItem?.vStockId;

            dbService.findOneAndUpdateRecord(
              "StockModel",
              {
                _id: new ObjectId(matchingStockItem?._id),
                vStockId: matchingStockItem?.vStockId,
              },
              {
                dPurchaseRate: element?.dPurchaseRate,
                vNotes: element?.vNotes ? element?.vNotes : "",
              },
              {
                returnOriginal: false,
              }
            );
          }
        }

        let allData = stockCount + addCount;
        let totalStockData = allData.toString().padStart(3, "0");
        const stockNumber = "S" + todayDate.concat(totalStockData);
        let stockObj = {
          vStockId: stockNumber,
          vProductTypeId: new ObjectId(element?.vProductTypeId),
          vProductQualityId: new ObjectId(element?.vProductQualityId),
          vProductColorId: new ObjectId(element?.vProductColorId),
          vProductDenierId: new ObjectId(element?.vProductDenierId),
          vPackingId: new ObjectId(element?.vPackingId),
          vNotes: element?.vNotes ? element?.vNotes : "",
          dPurchaseRate: element?.dPurchaseRate,
          vCreatedBy: new ObjectId(userId),
          dtCreatedAt: Date.now(),
        };

        let purchaseOrderDetailsObj = {
          vPoId: purchaseOrderNumber,
          vPOrderId: new ObjectId(savePurchaseOrderData?._id),
          vStockId: stockId ? stockId : stockNumber,
          dPurchaseRate: element?.dPurchaseRate,
          iQty: element?.iQty,
          vCreatedBy: new ObjectId(userId),
          dtCreatedAt: Date.now(),
        };

        stockArray.push(stockObj);
        purchaseDetailsArray.push(purchaseOrderDetailsObj);

        if (!stockAvailable) {
          addCount++;
        }
      });
    }

    if (!stockAvailable) {
      var saveStockData = await dbService.createManyRecords(
        "StockModel",
        stockArray
      );
      if (!saveStockData) throw new Error(Message.systemError);
    }

    const savePurchaseOrderDetailsData = await dbService.createManyRecords(
      "PurchaseOrderItemModel",
      purchaseDetailsArray
    );
    if (!savePurchaseOrderDetailsData) throw new Error(Message.systemError);

    let purchaseOrder = {
      _id: savePurchaseOrderData?._id,
      vPoId: savePurchaseOrderData?.vPoId,
      isComplete: savePurchaseOrderData?.isComplete,
    };

    return purchaseOrder;
  } catch (error) {
    console.error("saveError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = save;
