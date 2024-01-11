const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const deleteProductColor = async (entry) => {
  try {
    let {
      body: { vProductColorId },
    } = entry;

    let condition = {
      _id: new ObjectId(vProductColorId),
      isDeleted: false,
    };

    let checkData = await dbService.findOneRecord(
      "ProductColorModel",
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
      "ProductColorModel",
      condition,
      updateData,
      {
        returnOriginal: false,
      }
    );
    if (!updateResponse) throw new Error(Message.systemError);

    return [];
  } catch (error) {
    console.error("deleteProductColorError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = deleteProductColor;
