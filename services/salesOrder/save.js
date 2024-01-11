const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");
const moment = require("moment");

const save = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: {
        vCustomerId,
        dtOrderDate,
        dtExpDeliveryDate,
        arrSalesOrderItem = [],
      },
    } = entry;

    let todayDate = moment().format("YYYYMMDD");
    let currentDate = moment().format("YYYY-MM-DD");

    const salesCount = await dbService.recordsCount("SalesOrderModel", {
      isDeleted: false,
      dtCreatedAt: { $gte: Date.parse(currentDate) },
    });
    let totalData = salesCount + 1;
    let formattedNumber = totalData.toString().padStart(3, "0");
    const salesOrderNumber = "SO" + todayDate.concat(formattedNumber);

    const stockCount = await dbService.recordsCount("StockModel", {
      isDeleted: false,
    });

    let salesOrderSave = {
      vSoId: salesOrderNumber,
      vCustomerId: new ObjectId(vCustomerId),
      dtOrderDate: Date.parse(dtOrderDate),
      dtExpDeliveryDate: Date.parse(dtExpDeliveryDate),
      vCreatedBy: new ObjectId(userId),
      dtCreatedAt: Date.now(),
    };

    const saveSalesOrderData = await dbService.createOneRecord(
      "SalesOrderModel",
      salesOrderSave
    );
    if (!saveSalesOrderData) throw new Error(Message.systemError);

    let stockData = await dbService.findAllRecords("StockModel", {
      isDeleted: false,
    });

    let stockArray = [];
    let salesOrderItemArray = [];
    let stockAvailable = false;
    if (arrSalesOrderItem.length > 0) {
      let addCount = 1;
      let stockId = "";
      arrSalesOrderItem.forEach((element) => {
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
              { dSalesRate: element?.dSalesRate, vNotes: element?.vNotes },
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
          vNotes: element?.vNotes,
          dSalesRate: element?.dSalesRate,
          vCreatedBy: new ObjectId(userId),
          dtCreatedAt: Date.now(),
        };

        let salesOrderItemobj = {
          vSoId: salesOrderNumber,
          vSOrderId: new ObjectId(saveSalesOrderData?._id),
          vStockId: stockId ? stockId : stockNumber,
          iSalesQty: element?.iSalesQty,
          dSalesRate: element?.dSalesRate,
          vCreatedBy: new ObjectId(userId),
          dtCreatedAt: Date.now(),
        };

        stockArray.push(stockObj);
        salesOrderItemArray.push(salesOrderItemobj);

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

    const saveSalesOrderItemData = await dbService.createManyRecords(
      "SalesOrderItemModel",
      salesOrderItemArray
    );
    if (!saveSalesOrderItemData) throw new Error(Message.systemError);

    let salesOrderData = {
      _id: saveSalesOrderData?._id,
      vSoId: saveSalesOrderData?.vSoId,
      isComplete: saveSalesOrderData?.isComplete,
    };

    return salesOrderData;
  } catch (error) {
    console.error("saveError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = save;
