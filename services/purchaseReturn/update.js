const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");
const imageUpload = require("../../utils/imageUpload");

const update = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: {
        vPReturnId,
        vSupplierId,
        dtBillDate,
        dtReturnDate,
        iBillNumber,
        isSelectNote,
        vDebitNote,
        vCreditNote,
        vPurchaseReturnLinkImage,
        vNotes,
        arrPurchaseReturnItem = [],
      },
      file,
    } = entry;

    let condition = {
      _id: new ObjectId(vPReturnId),
      isDeleted: false,
    };

    let purchaseReturnData = await dbService.findOneRecord(
      "PurchaseReturnModel",
      condition
    );
    if (!purchaseReturnData?._id) throw new Error(Message.recordNotFound);

    let purchaseReturnUrlImage = vPurchaseReturnLinkImage;
    if (Object.keys(file).length > 0) {
      purchaseReturnUrlImage = await imageUpload(file);
    }

    let purchaseReturnUpdate = {
      vSupplierId: new ObjectId(vSupplierId),
      dtBillDate: Date.parse(dtBillDate),
      dtReturnDate: Date.parse(dtReturnDate),
      iBillNumber,
      isSelectNote,
      vDebitNote,
      vCreditNote,
      vNotes,
      isUpdated: true,
      dtUpdatedAt: Date.now(),
      vUpdatedBy: new ObjectId(userId),
    };

    if (isSelectNote) {
      purchaseReturnUpdate["vCreditImage"] = purchaseReturnUrlImage;
      purchaseReturnUpdate["vDebitImage"] = "";
    } else {
      purchaseReturnUpdate["vDebitImage"] = purchaseReturnUrlImage;
      purchaseReturnUpdate["vCreditImage"] = "";
    }

    let updatePurchaseReturnResponse = await dbService.findOneAndUpdateRecord(
      "PurchaseReturnModel",
      condition,
      purchaseReturnUpdate,
      {
        returnOriginal: false,
      }
    );
    if (!updatePurchaseReturnResponse) throw new Error(Message.systemError);

    let where = {
      vPReturnId: new ObjectId(vPReturnId),
      isDeleted: false,
    };
    let purchaseReturnItemData = await dbService.findAllRecords(
      "PurchaseReturnItemModel",
      where
    );

    let purchaseItemId = [];
    purchaseReturnItemData.forEach((item) => {
      if (item?.vStockId) {
        purchaseItemId.push({
          purchaseReturnItemId: item?._id,
          purchaseReturnStock: item?.vStockId,
        });
      }
    });

    if (arrPurchaseReturnItem.length > 0) {
      arrPurchaseReturnItem.forEach((element) => {
        let purchaseReturnItemObj = {};
        let stockObj = {
          vProductTypeId: new ObjectId(element?.vProductTypeId),
          vProductQualityId: new ObjectId(element?.vProductQualityId),
          vProductColorId: new ObjectId(element?.vProductColorId),
          vProductDenierId: new ObjectId(element?.vProductDenierId),
          vPackingId: new ObjectId(element?.vPackingId),
          vNotes: element?.vNotes ? element?.vNotes : "",
        };
        purchaseItemId.forEach((data) => {
          if (
            element?.vStockId.toString() == data?.purchaseReturnStock.toString()
          ) {
            purchaseReturnItemObj = {
              iReturnQty: element?.iReturnQty,
              iOldReturnQty: element?.iReturnQty,
              dPurchaseRate: element?.dPurchaseRate,
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
              "PurchaseReturnItemModel",
              {
                _id: new ObjectId(data?.purchaseReturnItemId),
              },
              purchaseReturnItemObj,
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
      _id: updatePurchaseReturnResponse?._id,
      vPRId: updatePurchaseReturnResponse?.vPRId,
    };

    return result;
  } catch (error) {
    console.error("updateError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = update;
