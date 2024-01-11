const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const save = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: { vName },
    } = entry;

    let filter = {
      isDeleted: false,
      vName,
    };

    let checkData = await dbService.findOneRecord(
      "ProductDenierModel",
      filter,
      {
        _id: 1,
      }
    );
    if (checkData) throw new Error(Message.nameAlreadyExists);

    const saveData = await dbService.createOneRecord("ProductDenierModel", {
      vName,
      vCreatedBy: new ObjectId(userId),
      dtCreatedAt: Date.now(),
    });
    if (!saveData) throw new Error(Message.systemError);

    return saveData;
  } catch (error) {
    console.error("saveError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = save;
