const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const deleteSupplier = async (entry) => {
  try {
    let {
      body: { vSupplierId },
    } = entry;

    let condition = {
      _id: new ObjectId(vSupplierId),
      isDeleted: false,
    };

    let checkData = await dbService.findOneRecord("SupplierModel", condition, {
      _id: 1,
    });
    if (!checkData?._id) throw new Error(Message.recordNotFound);

    let updateData = {
      isDeleted: true,
      dtDeletedAt: Date.now(),
    };

    let updateResponse = await dbService.findOneAndUpdateRecord(
      "SupplierModel",
      condition,
      updateData,
      {
        returnOriginal: false,
      }
    );
    if (!updateResponse) throw new Error(Message.systemError);

    return [];
  } catch (error) {
    console.error("deleteSupplierError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = deleteSupplier;
