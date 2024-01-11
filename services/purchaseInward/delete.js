const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const deletePurchaseInward = async (entry) => {
  try {
    let {
      body: { vPInwardId },
    } = entry;

    let condition = {
      _id: new ObjectId(vPInwardId),
      isDeleted: false,
    };

    let checkData = await dbService.findOneRecord(
      "PurchaseInwardModel",
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

    let updatePurchaseInwardResponse = await dbService.findOneAndUpdateRecord(
      "PurchaseInwardModel",
      condition,
      updateData,
      {
        returnOriginal: false,
      }
    );
    if (!updatePurchaseInwardResponse) throw new Error(Message.systemError);

    let updateInwardDetailsResponse = await dbService.updateManyRecords(
      "PurchaseInwardItemModel",
      { vPInwardId: new ObjectId(vPInwardId), isDeleted: false },
      updateData,
      {
        returnOriginal: false,
      }
    );
    if (!updateInwardDetailsResponse) throw new Error(Message.systemError);

    return [];
  } catch (error) {
    console.error("deletePurchaseInwardError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = deletePurchaseInward;
