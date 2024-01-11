const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");
const moment = require("moment");
const imageUpload = require("../../utils/imageUpload");

const save = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: {
        vSupplierId,
        dtBillDate,
        dtReturnDate,
        iBillNumber,
        isSelectNote,
        vDebitNote,
        vCreditNote,
        vNotes,
        arrPurchaseReturnItem = [],
      },
      file,
    } = entry;

    let todayDate = moment().format("YYYYMMDD");
    let currentDate = moment().format("YYYY-MM-DD");

    const purchaseReturnCount = await dbService.recordsCount(
      "PurchaseReturnModel",
      {
        isDeleted: false,
        dtCreatedAt: { $gte: Date.parse(currentDate) },
      }
    );
    let totalData = purchaseReturnCount + 1;
    let formattedNumber = totalData.toString().padStart(3, "0");
    const purchaseReturnNumber = "PR" + todayDate.concat(formattedNumber);

    let stockData = await dbService.findAllRecords("StockModel", {
      isDeleted: false,
    });

    let purchaseReturnItemArray = [];
    if (arrPurchaseReturnItem.length > 0) {
      arrPurchaseReturnItem.forEach((element) => {
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
            $inc: { iTotalQty: -element?.iReturnQty },
          };

          let purchaseReturnItemObj = {
            vPRId: purchaseReturnNumber,
            vStockId: matchingStockItem?.vStockId,
            iReturnQty: element?.iReturnQty,
            iOldReturnQty: element?.iReturnQty,
            dPurchaseRate: element?.dPurchaseRate,
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

          purchaseReturnItemArray.push(purchaseReturnItemObj);
        } else {
          throw new Error("This Stock is Not Exit");
        }
      });
    }

    let purchaseReturnUrlImage = "";
    if (Object.keys(file).length > 0) {
      purchaseReturnUrlImage = await imageUpload(file);
    }

    let purchaseReturnSave = {
      vPRId: purchaseReturnNumber,
      vSupplierId: new ObjectId(vSupplierId),
      dtBillDate: Date.parse(dtBillDate),
      dtReturnDate: Date.parse(dtReturnDate),
      iBillNumber,
      isSelectNote,
      vDebitNote,
      vCreditNote,
      vNotes,
      vCreatedBy: new ObjectId(userId),
      dtCreatedAt: Date.now(),
    };

    if (isSelectNote) {
      purchaseReturnSave["vCreditImage"] = purchaseReturnUrlImage;
    } else {
      purchaseReturnSave["vDebitImage"] = purchaseReturnUrlImage;
    }

    const savePurchaseReturnData = await dbService.createOneRecord(
      "PurchaseReturnModel",
      purchaseReturnSave
    );
    if (!savePurchaseReturnData) throw new Error(Message.systemError);

    let purchaseReturnDetailsArray = [];
    purchaseReturnItemArray.forEach((item) => {
      if (item) {
        let obj = {
          ...item,
          vPReturnId: new ObjectId(savePurchaseReturnData?._id),
        };
        purchaseReturnDetailsArray.push(obj);
      }
    });

    if (purchaseReturnDetailsArray?.length > 0) {
      let savePurchaseReturnItemData = await dbService.createManyRecords(
        "PurchaseReturnItemModel",
        purchaseReturnDetailsArray
      );
      if (!savePurchaseReturnItemData) throw new Error(Message.systemError);
    }

    let purchaseReturnData = {
      _id: savePurchaseReturnData?._id,
      vPRId: savePurchaseReturnData?.vPRId,
    };

    return purchaseReturnData;
  } catch (error) {
    console.error("saveError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = save;
