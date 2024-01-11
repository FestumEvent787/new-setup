const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");
const imageUpload = require("../../utils/imageUpload");

const update = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: {
        vPInwardId,
        dtChallanDate,
        vTransportationName,
        iChallanNO,
        iLRNO,
        iInvoiceNo,
        iEWayBill,
        vChallanLinkImage,
        vLRLinkImage,
        vInvoiceLinkImage,
        vEWayBillLinkImage,
        vNotes,
        arrPurchaseInwardItem = [],
      },
      files,
    } = entry;

    let condition = {
      _id: new ObjectId(vPInwardId),
      isDeleted: false,
    };

    let purchaseInwardData = await dbService.findOneRecord(
      "PurchaseInwardModel",
      condition,
      {
        _id: 1,
        vChallanImage: 1,
        vLRImage: 1,
        vInvoiceImage: 1,
        vEWayBillImage: 1,
      }
    );
    if (!purchaseInwardData?._id) throw new Error(Message.recordNotFound);

    let challanUrlImage = vChallanLinkImage;
    let lRUrlImage = vLRLinkImage;
    let invoiceUrlImage = vInvoiceLinkImage;
    let eWayBillUrlImage = vEWayBillLinkImage;
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

    let updateInwardResponse = await dbService.findOneAndUpdateRecord(
      "PurchaseInwardModel",
      condition,
      {
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
        isUpdated: true,
        dtUpdatedAt: Date.now(),
        vUpdatedBy: new ObjectId(userId),
      },
      {
        returnOriginal: false,
      }
    );
    if (!updateInwardResponse) throw new Error(Message.systemError);

    let purchaseInwardItemData = await dbService.findAllRecords(
      "PurchaseInwardItemModel",
      {
        vPInwardId: new ObjectId(vPInwardId),
        isDeleted: false,
      }
    );

    let purchaseInwardItemId = [];
    purchaseInwardItemData.forEach((item) => {
      if (item?.vStockId) {
        purchaseInwardItemId.push({
          inwardItemId: item?._id,
          inwardItemStockId: item?.vStockId,
          oldReceiveQty: item?.iReceiveQty,
        });
      }
    });

    if (arrPurchaseInwardItem.length > 0) {
      arrPurchaseInwardItem.forEach((element) => {
        purchaseInwardItemId.forEach((item) => {
          let purchaseInwardItemObj = {};
          let stockObj = {
            vProductTypeId: new ObjectId(element?.vProductTypeId),
            vProductQualityId: new ObjectId(element?.vProductQualityId),
            vProductColorId: new ObjectId(element?.vProductColorId),
            vProductDenierId: new ObjectId(element?.vProductDenierId),
            vPackingId: new ObjectId(element?.vPackingId),
            vNotes: element?.vNotes ? element?.vNotes : "",
            dPurchaseRate: element?.dPurchaseRate,
          };
          if (
            element?.vStockId.toString() == item?.inwardItemStockId.toString()
          ) {
            purchaseInwardItemObj = {
              dPurchaseRate: element?.dPurchaseRate,
              iReceiveQty: element?.iReceiveQty,
              isUpdated: true,
              dtUpdatedAt: Date.now(),
              vUpdatedBy: new ObjectId(userId),
            };

            if (element?.item?.oldReceiveQty > element?.iReceiveQty) {
              let total = item?.oldReceiveQty - element?.iReceiveQty;
              stockObj = {
                ...stockObj,
                $inc: { iTotalQty: total },
              };
            } else if (item?.oldReceiveQty < element?.iReceiveQty) {
              let total = element?.iReceiveQty - item?.oldReceiveQty;
              stockObj = {
                ...stockObj,
                $inc: { iTotalQty: -total },
              };
            }

            dbService.findOneAndUpdateRecord(
              "PurchaseInwardItemModel",
              {
                _id: new ObjectId(item?.inwardItemId),
              },
              purchaseInwardItemObj,
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

    let purchaseInward = {
      _id: updateInwardResponse?._id,
      vPoId: updateInwardResponse?.vPoId,
      vPInId: updateInwardResponse?.vPInId,
    };

    return purchaseInward;
  } catch (error) {
    console.error("updateError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = update;
