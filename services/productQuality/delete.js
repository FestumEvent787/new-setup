const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const deleteProductQuality = async (entry) => {
  try {
    let {
      body: { vProductQualityId },
    } = entry;

    let condition = {
      _id: new ObjectId(vProductQualityId),
      isDeleted: false,
    };

    let checkData = await dbService.findOneRecord(
      "ProductQualityModel",
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

    let updateResponse = await dbService.findOneAndUpdateRecord(
      "ProductQualityModel",
      condition,
      updateData,
      {
        returnOriginal: false,
      }
    );
    if (!updateResponse) throw new Error(Message.systemError);

    return [];
  } catch (error) {
    console.error("deleteProductQualityError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = deleteProductQuality;
