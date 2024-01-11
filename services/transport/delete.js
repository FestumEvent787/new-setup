const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const deleteTransport = async (entry) => {
  try {
    let {
      body: { vTransportId },
    } = entry;

    let condition = {
      _id: new ObjectId(vTransportId),
      isDeleted: false,
    };

    let checkData = await dbService.findOneRecord("TransportModel", condition, {
      _id: 1,
    });
    if (!checkData?._id) throw new Error(Message.recordNotFound);

    let updateData = {
      isDeleted: true,
      dtDeletedAt: Date.now(),
    };

    let updateResponse = await dbService.findOneAndUpdateRecord(
      "TransportModel",
      condition,
      updateData,
      {
        returnOriginal: false,
      }
    );
    if (!updateResponse) throw new Error(Message.systemError);

    return [];
  } catch (error) {
    console.error("deleteTransportError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = deleteTransport;
