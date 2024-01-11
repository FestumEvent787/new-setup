const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const getDetails = async (entry) => {
  try {
    let {
      body: { vPInwardId },
    } = entry;

    let filter = {
      _id: new ObjectId(vPInwardId),
      isDeleted: false,
    };

    const purchaseInwardData = await dbService.findOneRecord(
      "PurchaseInwardModel",
      filter
    );

    if (!purchaseInwardData?._id) return [];

    let stockArrayId = [];
    let where = {
      vPInwardId: new ObjectId(vPInwardId),
      isDeleted: false,
    };

    let purchaseInwardItemData = await dbService.findAllRecords(
      "PurchaseInwardItemModel",
      where
    );

    purchaseInwardItemData.forEach((item) => {
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
        _id: new ObjectId(purchaseInwardData?.vCreatedBy),
        isDeleted: false,
      },
      {
        _id: 1,
        vName: 1,
      }
    );

    let purchaseOrderData = await dbService.findOneRecord(
      "PurchaseOrderModel",
      {
        vPoId: purchaseInwardData?.vPoId,
        isDeleted: false,
      },
      {
        _id: 1,
        vSupplierId: 1,
      }
    );

    let supplierData = await dbService.findOneRecord(
      "SupplierModel",
      {
        _id: new ObjectId(purchaseOrderData?.vSupplierId),
        isDeleted: false,
      },
      {
        _id: 1,
        vContactPersonName: 1,
      }
    );

    let purchaseInwardItem = purchaseInwardItemData
      .filter((detail) => detail?.vPInId === purchaseInwardData?.vPInId)
      .map((detail) => {
        const stockDetails = stockData.find(
          (stock) => stock.vStockId === detail.vStockId
        );
        return {
          vPurchaseInwardItemId: detail._id,
          vStockId: detail?.vStockId,
          iReceiveQty: detail?.iReceiveQty,
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
      _id: purchaseInwardData?._id,
      vPoId: purchaseInwardData?.vPoId,
      vPInId: purchaseInwardData?.vPInId,
      vTransportationName: purchaseInwardData?.vTransportationName,
      vSupplierName: supplierData?.vContactPersonName,
      dtChallanDate: purchaseInwardData?.dtChallanDate,
      iChallanNO: purchaseInwardData?.iChallanNO,
      iLRNO: purchaseInwardData?.iLRNO,
      iInvoiceNo: purchaseInwardData?.iInvoiceNo,
      iEWayBill: purchaseInwardData?.iEWayBill,
      vChallanImage: purchaseInwardData?.vChallanImage,
      vLRImage: purchaseInwardData?.vLRImage,
      vInvoiceImage: purchaseInwardData?.vInvoiceImage,
      vEWayBillImage: purchaseInwardData?.vEWayBillImage,
      vNotes: purchaseInwardData?.vNotes,
      vCreatedBy: purchaseInwardData?.vCreatedBy,
      vCreatedByName: userData?.vName,
      dtCreatedAt: purchaseInwardData?.dtCreatedAt,
      purchaseInwardItem,
    };

    return result;
  } catch (error) {
    console.error("getDetailsError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = getDetails;
