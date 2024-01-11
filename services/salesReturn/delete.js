const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const deleteSalesReturn = async (entry) => {
  try {
    let {
      body: { vSReturnId },
    } = entry;

    let condition = {
      _id: new ObjectId(vSReturnId),
      isDeleted: false,
    };

    let checkData = await dbService.findOneRecord(
      "SalesReturnModel",
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

    let updateSalesReturnResponse = await dbService.findOneAndUpdateRecord(
      "SalesReturnModel",
      condition,
      updateData,
      {
        returnOriginal: false,
      }
    );
    if (!updateSalesReturnResponse) throw new Error(Message.systemError);

    let filter = {
      vSReturnId: new ObjectId(vSReturnId),
      isDeleted: false,
    };
    let updateSalesReturnItemResponse = await dbService.updateManyRecords(
      "SalesReturnItemModel",
      filter,
      updateData,
      {
        returnOriginal: false,
      }
    );
    if (!updateSalesReturnItemResponse) throw new Error(Message.systemError);

    return [];
  } catch (error) {
    console.error("deleteSalesReturnError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = deleteSalesReturn;
