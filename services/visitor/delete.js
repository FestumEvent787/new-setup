const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const deleteVisitor = async (entry) => {
  try {
    let {
      body: { vVisitorId },
    } = entry;

    let condition = {
      _id: new ObjectId(vVisitorId),
      isDeleted: false,
    };

    let checkData = await dbService.findOneRecord("VisitorModel", condition, {
      _id: 1,
    });
    if (!checkData?._id) throw new Error(Message.recordNotFound);

    let updateData = {
      isDeleted: true,
      dtDeletedAt: Date.now(),
    };

    let updateResponse = await dbService.findOneAndUpdateRecord(
      "VisitorModel",
      condition,
      updateData,
      {
        returnOriginal: false,
      }
    );
    if (!updateResponse) throw new Error(Message.systemError);

    return [];
  } catch (error) {
    console.error("deleteVisitorError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = deleteVisitor;
