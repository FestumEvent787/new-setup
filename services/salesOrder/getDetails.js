const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const getDetails = async (entry) => {
  try {
    let {
      body: { vSOrderId },
    } = entry;

    let filter = {
      _id: new ObjectId(vSOrderId),
      isDeleted: false,
    };

    const salesOrderData = await dbService.findOneRecord(
      "SalesOrderModel",
      filter
    );

    if (!salesOrderData?._id) return [];

    let stockArrayId = [];
    let where = {
      vSOrderId: new ObjectId(vSOrderId),
      isDeleted: false,
    };

    let salesItemData = await dbService.findAllRecords(
      "SalesOrderItemModel",
      where
    );

    salesItemData.forEach((item) => {
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
        _id: new ObjectId(salesOrderData?.vCreatedBy),
        isDeleted: false,
      },
      {
        _id: 1,
        vName: 1,
      }
    );

    let customerData = await dbService.findOneRecord(
      "CustomerModel",
      {
        _id: new ObjectId(salesOrderData?.vCustomerId),
        isDeleted: false,
      },
      {
        _id: 1,
        vContactPersonName: 1,
      }
    );

    let salesOrderItem = salesItemData
      .filter((detail) => detail?.vSoId === salesOrderData?.vSoId)
      .map((detail) => {
        const stockDetails = stockData.find(
          (stock) => stock.vStockId === detail.vStockId
        );
        return {
          vSalesOrderItemId: detail._id,
          vStockId: detail?.vStockId,
          iSalesQty: detail?.iSalesQty,
          dSalesRate: detail?.dSalesRate,
          vNotes: detail?.vNotes,
          iTotalQty: stockDetails?.iTotalQty,
          vProductTypeId: stockDetails?.vProductTypeId,
          vProductQualityId: stockDetails?.vProductQualityId,
          vProductColorId: stockDetails?.vProductColorId,
          vProductDenierId: stockDetails?.vProductDenierId,
          vPackingId: stockDetails?.vPackingId,
        };
      });

    const result = {
      _id: salesOrderData?._id,
      vSoId: salesOrderData?.vSoId,
      isComplete: salesOrderData?.isComplete,
      vCustomerId: salesOrderData?.vCustomerId,
      vCustomerName: customerData?.vContactPersonName,
      dtOrderDate: salesOrderData?.dtOrderDate,
      dtExpDeliveryDate: salesOrderData?.dtExpDeliveryDate,
      vCreatedBy: salesOrderData?.vCreatedBy,
      vCreatedByName: userData?.vName,
      dtCreatedAt: salesOrderData?.dtCreatedAt,
      salesOrderItem,
    };

    return result;
  } catch (error) {
    console.error("getDetailsError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = getDetails;
