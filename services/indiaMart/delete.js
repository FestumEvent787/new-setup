const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const deleteIndiaMart = async (entry) => {
  try {
    let {
      body: { vIndiaMartId },
    } = entry;

    let condition = {
      _id: new ObjectId(vIndiaMartId),
      isDeleted: false,
    };

    let checkData = await dbService.findOneRecord("IndiaMartModel", condition, {
      _id: 1,
    });
    if (!checkData?._id) throw new Error(Message.recordNotFound);

    let updateData = {
      isDeleted: true,
      dtDeletedAt: Date.now(),
    };

    let updateResponse = await dbService.findOneAndUpdateRecord(
      "IndiaMartModel",
      condition,
      updateData,
      {
        returnOriginal: false,
      }
    );
    if (!updateResponse) throw new Error(Message.systemError);

    return [];
  } catch (error) {
    console.error("deleteIndiaMartError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = deleteIndiaMart;
