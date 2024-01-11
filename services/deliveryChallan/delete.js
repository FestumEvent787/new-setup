const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const deleteDeliveryChallan = async (entry) => {
  try {
    let {
      body: { vDChallanId },
    } = entry;

    let condition = {
      _id: new ObjectId(vDChallanId),
      isDeleted: false,
    };

    let checkData = await dbService.findOneRecord(
      "DeliveryChallanModel",
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

    let updateDeliveryResponse = await dbService.findOneAndUpdateRecord(
      "DeliveryChallanModel",
      condition,
      updateData,
      {
        returnOriginal: false,
      }
    );
    if (!updateDeliveryResponse) throw new Error(Message.systemError);

    let filter = {
      vDChallanId: new ObjectId(vDChallanId),
      isDeleted: false,
    };

    let updateDeliveryItemResponse = await dbService.updateManyRecords(
      "DeliveryChallanItemModel",
      filter,
      updateData,
      {
        returnOriginal: false,
      }
    );
    if (!updateDeliveryItemResponse) throw new Error(Message.systemError);

    return [];
  } catch (error) {
    console.error("deleteDeliveryChallanError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = deleteDeliveryChallan;
