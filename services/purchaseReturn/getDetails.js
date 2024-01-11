const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const getDetails = async (entry) => {
  try {
    let {
      body: { vPReturnId },
    } = entry;

    let filter = {
      _id: new ObjectId(vPReturnId),
      isDeleted: false,
    };

    const purchaseReturnData = await dbService.findOneRecord(
      "PurchaseReturnModel",
      filter
    );

    if (!purchaseReturnData?._id) return [];

    let stockArrayId = [];
    let where = {
      vPReturnId: new ObjectId(vPReturnId),
      isDeleted: false,
    };

    let purchaseReturnItemData = await dbService.findAllRecords(
      "PurchaseReturnItemModel",
      where
    );

    purchaseReturnItemData.forEach((item) => {
      if (item?.vStockId && !stockArrayId.includes(item?.vStockId)) {
        stockArrayId.push(item?.vStockId);
      }
    });

    let condition = {
      vStockId: { $in: stockArrayId },
      isDeleted: false,
    };
    let stockData = await dbService.findAllRecords("StockModel", condition);

    let userData = await dbService.findOneRecord(
      "UserModel",
      {
        _id: new ObjectId(purchaseReturnData?.vCreatedBy),
        isDeleted: false,
      },
      {
        _id: 1,
        vName: 1,
      }
    );

    let supplierData = await dbService.findOneRecord(
      "SupplierModel",
      {
        _id: new ObjectId(purchaseReturnData?.vSupplierId),
        isDeleted: false,
      },
      {
        _id: 1,
        vContactPersonName: 1,
      }
    );

    let purchaseReturnItem = purchaseReturnItemData
      .filter((detail) => detail?.vPRId === purchaseReturnData?.vPRId)
      .map((detail) => {
        const stockDetails = stockData.find(
          (stock) => stock.vStockId === detail.vStockId
        );
        return {
          vPurchaseReturnItemId: detail._id,
          vStockId: detail?.vStockId,
          iReturnQty: detail?.iReturnQty,
          iOldReturnQty: detail?.iOldReturnQty,
          dPurchaseRate: detail?.dPurchaseRate,
          iTotalQty: stockDetails?.iTotalQty,
          vProductTypeId: stockDetails?.vProductTypeId,
          vProductQualityId: stockDetails?.vProductQualityId,
          vProductColorId: stockDetails?.vProductColorId,
          vProductDenierId: stockDetails?.vProductDenierId,
          vPackingId: stockDetails?.vPackingId,
          vStockNotes: stockDetails?.vNotes,
        };
      });

    const result = {
      _id: purchaseReturnData?._id,
      vPRId: purchaseReturnData?.vPRId,
      vSupplierId: purchaseReturnData?.vSupplierId,
      vSupplierName: supplierData?.vContactPersonName,
      dtBillDate: purchaseReturnData?.dtBillDate,
      dtReturnDate: purchaseReturnData?.dtReturnDate,
      iBillNumber: purchaseReturnData?.iBillNumber,
      isSelectNote: purchaseReturnData?.isSelectNote,
      vDebitNote: purchaseReturnData?.vDebitNote,
      vCreditNote: purchaseReturnData?.vCreditNote,
      vDebitImage: purchaseReturnData?.vDebitImage,
      vCreditImage: purchaseReturnData?.vCreditImage,
      vNotes: purchaseReturnData?.vNotes,
      vCreatedBy: purchaseReturnData?.vCreatedBy,
      vCreatedByName: userData?.vName,
      dtCreatedAt: purchaseReturnData?.dtCreatedAt,
      purchaseReturnItem,
    };

    return result;
  } catch (error) {
    console.error("getDetailsError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = getDetails;
