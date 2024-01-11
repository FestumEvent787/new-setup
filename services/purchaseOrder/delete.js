const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const deletePurchaseOrder = async (entry) => {
  try {
    let {
      body: { vPOrderId },
    } = entry;

    let condition = {
      _id: new ObjectId(vPOrderId),
      isDeleted: false,
    };

    let checkData = await dbService.findOneRecord(
      "PurchaseOrderModel",
      condition,
      {
        _id: 1,
      }
    );
    if (!checkData?._id) throw new Error(Message.recordNotFound);

    let updateData = {
      isDeleted: true,
      dtDeletedAt: Date.now(),
    };

    let updatePurchaseOrderResponse = await dbService.findOneAndUpdateRecord(
      "PurchaseOrderModel",
      condition,
      updateData,
      {
        returnOriginal: false,
      }
    );
    if (!updatePurchaseOrderResponse) throw new Error(Message.systemError);

    let filter = {
      vPOrderId: new ObjectId(vPOrderId),
      isDeleted: false,
    };
    // let purchaseDetailsData = await dbService.findAllRecords(
    //   "PurchaseOrderItemModel",
    //   filter
    // );

    // let stockArrayId = [];
    // purchaseDetailsData.forEach((item) => {
    //   if (item?.vStockId) {
    //     stockArrayId.push(item?.vStockId);
    //   }
    // });

    let updatePurchaseOrderDetailsResponse = await dbService.updateManyRecords(
      "PurchaseOrderItemModel",
      filter,
      updateData,
      {
        returnOriginal: false,
      }
    );
    if (!updatePurchaseOrderDetailsResponse)
      throw new Error(Message.systemError);

    // let where = {
    //   vStockId: { $in: stockArrayId },
    //   isDeleted: false,
    // };

    // let stockResponse = await dbService.updateManyRecords(
    //   "StockModel",
    //   where,
    //   updateData,
    //   {
    //     returnOriginal: false,
    //   }
    // );
    // if (!stockResponse) throw new Error(Message.systemError);

    return [];
  } catch (error) {
    console.error("deletePurchaseOrderError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = deletePurchaseOrder;
