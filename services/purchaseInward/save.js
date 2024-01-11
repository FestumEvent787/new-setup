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
        vPoId,
        dtChallanDate,
        vTransportationName,
        iChallanNO,
        iLRNO,
        iInvoiceNo,
        iEWayBill,
        vNotes,
        arrPurchaseInwardItem = [],
      },
      files,
    } = entry;

    let todayDate = moment().format("YYYYMMDD");
    let currentDate = moment().format("YYYY-MM-DD");
    const purchaseInwardCount = await dbService.recordsCount(
      "PurchaseInwardModel",
      {
        isDeleted: false,
        dtCreatedAt: { $gte: Date.parse(currentDate) },
      }
    );
    let totalData = purchaseInwardCount + 1;
    let formattedNumber = totalData.toString().padStart(3, "0");
    const purchaseInwardNumber = "PIn" + todayDate.concat(formattedNumber);

    let stockData = await dbService.findAllRecords("StockModel", {
      isDeleted: false,
    });

    let purchaseInwardItemArray = [];
    if (arrPurchaseInwardItem.length > 0) {
      arrPurchaseInwardItem.forEach((element) => {
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
            $inc: { iTotalQty: element?.iReceiveQty },
            vNotes: element?.vNotes,
          };

          let purchaseInwardItemObj = {
            vPInId: purchaseInwardNumber,
            vStockId: matchingStockItem?.vStockId,
            dPurchaseRate: element?.dPurchaseRate,
            iReceiveQty: element?.iReceiveQty,
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

          purchaseInwardItemArray.push(purchaseInwardItemObj);
        } else {
          throw new Error("This Stock is Not Exit");
        }
      });
    }

    let challanUrlImage = "";
    let lRUrlImage = "";
    let invoiceUrlImage = "";
    let eWayBillUrlImage = "";
    if (Object.keys(files).length > 0) {
      if (
        files?.vChallanImage &&
        Object.keys(files?.vChallanImage[0]).length > 0
      ) {
        challanUrlImage = await imageUpload(files?.vChallanImage[0]);
      }
      if (files?.vLRImage && Object.keys(files?.vLRImage[0]).length > 0) {
        lRUrlImage = await imageUpload(files?.vLRImage[0]);
      }
      if (
        files?.vInvoiceImage &&
        Object.keys(files?.vInvoiceImage[0]).length > 0
      ) {
        invoiceUrlImage = await imageUpload(files?.vInvoiceImage[0]);
      }
      if (
        files?.vEWayBillImage &&
        Object.keys(files?.vEWayBillImage[0]).length > 0
      ) {
        eWayBillUrlImage = await imageUpload(files?.vEWayBillImage[0]);
      }
    }

    let purchaseInwardSave = {
      vPoId,
      vPInId: purchaseInwardNumber,
      dtChallanDate: Date.parse(dtChallanDate),
      vTransportationName,
      iChallanNO,
      iLRNO,
      iInvoiceNo,
      iEWayBill,
      vChallanImage: challanUrlImage,
      vLRImage: lRUrlImage,
      vInvoiceImage: invoiceUrlImage,
      vEWayBillImage: eWayBillUrlImage,
      vNotes,
      vCreatedBy: new ObjectId(userId),
      dtCreatedAt: Date.now(),
    };
    const savePurchaseInwardData = await dbService.createOneRecord(
      "PurchaseInwardModel",
      purchaseInwardSave
    );
    if (!savePurchaseInwardData) throw new Error(Message.systemError);

    let purchaseInwardDetailsArray = [];
    purchaseInwardItemArray.forEach((item) => {
      if (item) {
        let obj = {
          ...item,
          vPInwardId: new ObjectId(savePurchaseInwardData?._id),
        };
        purchaseInwardDetailsArray.push(obj);
      }
    });

    if (purchaseInwardDetailsArray.length > 0) {
      var savePurchaseInwardItemData = await dbService.createManyRecords(
        "PurchaseInwardItemModel",
        purchaseInwardDetailsArray
      );
      if (!savePurchaseInwardItemData) throw new Error(Message.systemError);
    }

    let purchaseOrderComplete = true;
    let getAllPurchaseOrderItem = await dbService.findAllRecords(
      "PurchaseOrderItemModel",
      {
        isDeleted: false,
        vPoId: savePurchaseInwardData?.vPoId,
      },
      { vStockId: 1, iQty: 1 }
    );

    for (let i = 0; i < getAllPurchaseOrderItem.length; i++) {
      const poItem = getAllPurchaseOrderItem[i];
      const stockItem = stockData.find(
        (item) => item.vStockId === poItem.vStockId
      );

      if (!stockItem || poItem.iQty > stockItem.iTotalQty) {
        purchaseOrderComplete = false;
        break;
      }
    }

    if (purchaseOrderComplete) {
      dbService.findOneAndUpdateRecord(
        "PurchaseOrderModel",
        {
          vPoId: savePurchaseInwardData?.vPoId,
        },
        { isComplete: true },
        {
          returnOriginal: false,
        }
      );
    }

    let purchaseReturnData = {
      _id: savePurchaseInwardData?._id,
      vPoId: savePurchaseInwardData?.vPoId,
      vPInId: savePurchaseInwardData?.vPInId,
    };

    return purchaseReturnData;
  } catch (error) {
    console.error("saveError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = save;
