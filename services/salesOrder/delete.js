const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const deleteSalesOrder = async (entry) => {
  try {
    let {
      body: { vSOrderId },
    } = entry;

    let condition = {
      _id: new ObjectId(vSOrderId),
      isDeleted: false,
    };

    let checkData = await dbService.findOneRecord(
      "SalesOrderModel",
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

    let updateSalesOrderResponse = await dbService.findOneAndUpdateRecord(
      "SalesOrderModel",
      condition,
      updateData,
      {
        returnOriginal: false,
      }
    );
    if (!updateSalesOrderResponse) throw new Error(Message.systemError);

    let filter = {
      vSOrderId: new ObjectId(vSOrderId),
      isDeleted: false,
    };

    let updateSalesOrderItemResponse = await dbService.updateManyRecords(
      "SalesOrderItemModel",
      filter,
      updateData,
      {
        returnOriginal: false,
      }
    );
    if (!updateSalesOrderItemResponse) throw new Error(Message.systemError);

    return [];
  } catch (error) {
    console.error("deleteSalesOrderError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = deleteSalesOrder;
