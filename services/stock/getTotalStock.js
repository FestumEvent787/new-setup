const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const getTotalStock = async (entry) => {
  try {
    let {
      body: {
        vProductTypeId,
        vProductQualityId,
        vProductColorId,
        vProductDenierId,
        vPackingId,
      },
    } = entry;

    let filter = {
      isDeleted: false,
      vProductTypeId: new ObjectId(vProductTypeId),
      vProductQualityId: new ObjectId(vProductQualityId),
      vProductColorId: new ObjectId(vProductColorId),
      vProductDenierId: new ObjectId(vProductDenierId),
      vPackingId: new ObjectId(vPackingId),
    };

    let stockData = await dbService.findOneRecord("StockModel", filter);
    let result = {};
    if (stockData?.length > 0) {
      result = {
        iTotalQty: stockData?.iTotalQty,
        dPurchaseRate: stockData?.dPurchaseRate,
      };
    } else {
      result = {
        iTotalQty: 0,
        dPurchaseRate: 0,
      };
    }

    return result;
  } catch (error) {
    console.error("getTotalStockError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = getTotalStock;
