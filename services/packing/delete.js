const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const deletePacking = async (entry) => {
  try {
    let {
      body: { vPackingId },
    } = entry;

    let condition = {
      _id: new ObjectId(vPackingId),
      isDeleted: false,
    };

    let checkData = await dbService.findOneRecord("PackingModel", condition, {
      _id: 1,
    });
    if (!checkData?._id) throw new Error(Message.recordNotFound);

    let updateData = {
      isDeleted: true,
      dtDeletedAt: Date.now(),
    };

    let updateResponse = await dbService.findOneAndUpdateRecord(
      "PackingModel",
      condition,
      updateData,
      {
        returnOriginal: false,
      }
    );
    if (!updateResponse) throw new Error(Message.systemError);

    return [];
  } catch (error) {
    console.error("deletePackingError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = deletePacking;
