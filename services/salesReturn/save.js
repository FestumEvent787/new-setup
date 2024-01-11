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
        iDeliveryChallan,
        dtBillDate,
        dtReturnDate,
        iBillNumber,
        iLRNumber,
        vNotes,
        arrSalesReturnItem = [],
      },
    } = entry;

    let todayDate = moment().format("YYYYMMDD");
    let currentDate = moment().format("YYYY-MM-DD");

    const salesReturnCount = await dbService.recordsCount("SalesReturnModel", {
      isDeleted: false,
      dtCreatedAt: { $gte: Date.parse(currentDate) },
    });
    let totalData = salesReturnCount + 1;
    let formattedNumber = totalData.toString().padStart(3, "0");
    const salesReturnNumber = "SR" + todayDate.concat(formattedNumber);

    let stockData = await dbService.findAllRecords("StockModel", {
      isDeleted: false,
    });

    let salesReturnItemArray = [];
    if (arrSalesReturnItem.length > 0) {
      arrSalesReturnItem.forEach((element) => {
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
          let stockObj = {
            vNotes: element?.vNotes ? element?.vNotes : "",
            $inc: { iTotalQty: element?.iReturnQty },
          };

          let salesReturnItemObj = {
            vSRId: salesReturnNumber,
            vStockId: matchingStockItem?.vStockId,
            iReturnQty: element?.iReturnQty,
            iOldReturnQty: element?.iReturnQty,
            dSalesRate: element?.dSalesRate,
            vCreatedBy: new ObjectId(userId),
            dtCreatedAt: Date.now(),
          };

          dbService.findOneAndUpdateRecord(
            "StockModel",
            {
              vStockId: matchingStockItem?.vStockId,
            },
            stockObj,
            {
              returnOriginal: false,
            }
          );

          salesReturnItemArray.push(salesReturnItemObj);
        } else {
          throw new Error("This Stock is Not Exit");
        }
      });
    }

    let salesReturnSave = {
      vSRId: salesReturnNumber,
      vCustomerId: new ObjectId(vCustomerId),
      iDeliveryChallan,
      dtBillDate: Date.parse(dtBillDate),
      dtReturnDate: Date.parse(dtReturnDate),
      iBillNumber,
      iLRNumber,
      vNotes,
      vCreatedBy: new ObjectId(userId),
      dtCreatedAt: Date.now(),
    };

    const saveSalesReturnData = await dbService.createOneRecord(
      "SalesReturnModel",
      salesReturnSave
    );
    if (!saveSalesReturnData) throw new Error(Message.systemError);

    let salesReturnDetailsArray = [];
    salesReturnItemArray.forEach((item) => {
      if (item) {
        let obj = {
          ...item,
          vSReturnId: new ObjectId(saveSalesReturnData?._id),
        };
        salesReturnDetailsArray.push(obj);
      }
    });

    if (salesReturnDetailsArray?.length > 0) {
      var saveSalesReturnItemData = await dbService.createManyRecords(
        "SalesReturnItemModel",
        salesReturnDetailsArray
      );
      if (!saveSalesReturnItemData) throw new Error(Message.systemError);
    }

    let salesReturnData = {
      _id: saveSalesReturnData?._id,
      vSRId: saveSalesReturnData?.vSRId,
    };

    return salesReturnData;
  } catch (error) {
    console.error("saveError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = save;
