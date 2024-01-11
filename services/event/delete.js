const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const deleteEvent = async (entry) => {
  try {
    let {
      body: { vEventId },
    } = entry;

    let condition = {
      _id: new ObjectId(vEventId),
      isDeleted: false,
    };

    let checkData = await dbService.findOneRecord("EventModel", condition, {
      _id: 1,
    });
    if (!checkData?._id) throw new Error(Message.recordNotFound);

    let updateData = {
      isDeleted: true,
      dtDeletedAt: Date.now(),
    };

    let updateResponse = await dbService.findOneAndUpdateRecord(
      "EventModel",
      condition,
      updateData,
      {
        returnOriginal: false,
      }
    );
    if (!updateResponse) throw new Error(Message.systemError);

    return [];
  } catch (error) {
    console.error("deleteEventError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = deleteEvent;
