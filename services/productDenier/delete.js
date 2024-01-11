const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const deleteProductDenier = async (entry) => {
  try {
    let {
      body: { vProductDenierId },
    } = entry;

    let condition = {
      _id: new ObjectId(vProductDenierId),
      isDeleted: false,
    };

    let checkData = await dbService.findOneRecord(
      "ProductDenierModel",
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
      "ProductDenierModel",
      condition,
      updateData,
      {
        returnOriginal: false,
      }
    );
    if (!updateResponse) throw new Error(Message.systemError);

    return [];
  } catch (error) {
    console.error("deleteProductDenierError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = deleteProductDenier;
