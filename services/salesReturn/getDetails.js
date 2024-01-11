const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const getDetails = async (entry) => {
  try {
    let {
      body: { vSReturnId },
    } = entry;

    let filter = {
      _id: new ObjectId(vSReturnId),
      isDeleted: false,
    };

    const salesReturnData = await dbService.findOneRecord(
      "SalesReturnModel",
      filter
    );

    if (!salesReturnData?._id) return [];

    let stockArrayId = [];
    let where = {
      vSReturnId: new ObjectId(vSReturnId),
      isDeleted: false,
    };

    let salesReturnItemData = await dbService.findAllRecords(
      "SalesReturnItemModel",
      where
    );

    salesReturnItemData.forEach((item) => {
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
        _id: new ObjectId(salesReturnData?.vCreatedBy),
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
        _id: new ObjectId(salesReturnData?.vCustomerId),
        isDeleted: false,
      },
      {
        _id: 1,
        vContactPersonName: 1,
      }
    );

    let salesReturnItem = salesReturnItemData
      .filter((detail) => detail?.vSRId === salesReturnData?.vSRId)
      .map((detail) => {
        const stockDetails = stockData.find(
          (stock) => stock.vStockId === detail.vStockId
        );
        return {
          vsalesReturnItemId: detail._id,
          vStockId: detail?.vStockId,
          iReturnQty: detail?.iReturnQty,
          iOldReturnQty: detail?.iOldReturnQty,
          dSalesRate: detail?.dSalesRate,
          iTotalQty: stockDetails?.iTotalQty,
          vProductTypeId: stockDetails?.vProductTypeId,
          vProductQualityId: stockDetails?.vProductQualityId,
          vProductColorId: stockDetails?.vProductColorId,
          vProductDenierId: stockDetails?.vProductDenierId,
          vPackingId: stockDetails?.vPackingId,
        };
      });

    const result = {
      _id: salesReturnData?._id,
      vSRId: salesReturnData?.vSRId,
      vCustomerId: salesReturnData?.vCustomerId,
      vCustomerName: customerData?.vContactPersonName,
      iDeliveryChallan: salesReturnData?.iDeliveryChallan,
      dtBillDate: salesReturnData?.dtBillDate,
      dtReturnDate: salesReturnData?.dtReturnDate,
      iBillNumber: salesReturnData?.iBillNumber,
      iLRNumber: salesReturnData?.iLRNumber,
      vNotes: salesReturnData?.vNotes,
      vCreatedBy: salesReturnData?.vCreatedBy,
      vCreatedByName: userData?.vName,
      dtCreatedAt: salesReturnData?.dtCreatedAt,
      salesReturnItem,
    };

    return result;
  } catch (error) {
    console.error("getDetailsError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = getDetails;
