const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const getDetails = async (entry) => {
  try {
    let {
      body: { vPOrderId },
    } = entry;

    let filter = {
      _id: new ObjectId(vPOrderId),
      isDeleted: false,
    };

    const purchaseOrderData = await dbService.findOneRecord(
      "PurchaseOrderModel",
      filter
    );

    if (!purchaseOrderData?._id) return [];

    let stockArrayId = [];
    let where = {
      vPOrderId: new ObjectId(vPOrderId),
      isDeleted: false,
    };

    let purchaseDetailsData = await dbService.findAllRecords(
      "PurchaseOrderItemModel",
      where
    );

    purchaseDetailsData.forEach((item) => {
      if (item?.vStockId && !stockArrayId.includes(item?.vStockId)) {
        stockArrayId.push(item?.vStockId);
      }
    });

    let condition = {
      vStockId: { $in: stockArrayId },
      isDeleted: false,
    };
    let stockData = await dbService.findAllRecords("StockModel", condition);

    let purchaseInwardData = await dbService.findAllRecords(
      "PurchaseInwardModel",
      {
        vPoId: purchaseOrderData?.vPoId,
        isDeleted: false,
      }
    );

    let purchaseInwardId = [];
    purchaseInwardData.forEach((element) => {
      if (element?._id) {
        purchaseInwardId.push(new ObjectId(element?._id));
      }
    });

    let whereCondition = {
      vPInwardId: { $in: purchaseInwardId },
      isDeleted: false,
    };
    let purchaseInwardItemData = await dbService.findAllRecords(
      "PurchaseInwardItemModel",
      whereCondition
    );

    let userData = await dbService.findOneRecord(
      "UserModel",
      {
        _id: new ObjectId(purchaseOrderData?.vCreatedBy),
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
        _id: new ObjectId(purchaseOrderData?.vSupplierId),
        isDeleted: false,
      },
      {
        _id: 1,
        vContactPersonName: 1,
      }
    );

    let purchaseOrderDetails = purchaseDetailsData
      .filter((detail) => detail?.vPoId === purchaseOrderData?.vPoId)
      .map((detail) => {
        const stockDetails = stockData.find(
          (stock) => stock.vStockId === detail.vStockId
        );
        const purchaseInwardItemDetails = purchaseInwardItemData
          .filter((inwardData) => inwardData.vStockId === detail.vStockId)
          .map((item) => {
            return {
              iReceiveQty: item?.iReceiveQty,
              dtCreatedAt: item?.dtCreatedAt,
            };
          });
        return {
          vPurchaseOrderItemId: detail._id,
          vStockId: detail?.vStockId,
          dPurchaseRate: detail?.dPurchaseRate,
          iQty: detail?.iQty,
          arrOrderReceiveDetails: purchaseInwardItemDetails,
          iTotalQty: stockDetails?.iTotalQty,
          vProductTypeId: stockDetails?.vProductTypeId,
          vProductQualityId: stockDetails?.vProductQualityId,
          vProductColorId: stockDetails?.vProductColorId,
          vProductDenierId: stockDetails?.vProductDenierId,
          vPackingId: stockDetails?.vPackingId,
          vNotes: stockDetails?.vNotes,
        };
      });

    const result = {
      _id: purchaseOrderData?._id,
      vPoId: purchaseOrderData?.vPoId,
      isComplete: purchaseOrderData?.isComplete,
      dtOrderDate: purchaseOrderData?.dtOrderDate,
      dtExpDeliveryDate: purchaseOrderData?.dtExpDeliveryDate,
      vSupplierId: purchaseOrderData?.vSupplierId,
      vSupplierName: supplierData?.vContactPersonName,
      vCreatedBy: purchaseOrderData?.vCreatedBy,
      vCreatedByName: userData?.vName,
      dtCreatedAt: purchaseOrderData?.dtCreatedAt,
      purchaseOrderDetails,
    };

    return result;
  } catch (error) {
    console.error("getDetailsError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = getDetails;
