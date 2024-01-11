const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const deletePurchaseReturn = async (entry) => {
  try {
    let {
      body: { vPReturnId },
    } = entry;

    let condition = {
      _id: new ObjectId(vPReturnId),
      isDeleted: false,
    };

    let checkData = await dbService.findOneRecord(
      "PurchaseReturnModel",
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

    let updatePurchaseReturnResponse = await dbService.findOneAndUpdateRecord(
      "PurchaseReturnModel",
      condition,
      updateData,
      {
        returnOriginal: false,
      }
    );
    if (!updatePurchaseReturnResponse) throw new Error(Message.systemError);

    let filter = {
      vPReturnId: new ObjectId(vPReturnId),
      isDeleted: false,
    };
    let updatePurchaseReturnItemResponse = await dbService.updateManyRecords(
      "PurchaseReturnItemModel",
      filter,
      updateData,
      {
        returnOriginal: false,
      }
    );
    if (!updatePurchaseReturnItemResponse) throw new Error(Message.systemError);

    return [];
  } catch (error) {
    console.error("deletePurchaseReturnError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = deletePurchaseReturn;
