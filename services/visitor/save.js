const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");
const imageUpload = require("../../utils/imageUpload");

const save = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: {
        vEventId,
        vName,
        dtVisit,
        vMobile1,
        vMobile2,
        vCompanyName,
        vAddress,
        vCityId,
        objEngagesMachine,
        objDealingIn,
        vSampleRequire,
        vRemarks,
        vRepresentedName,
      },
      files,
    } = entry;

    let filter = {
      isDeleted: false,
      $or: [{ vMobile1 }, { vMobile2 }],
      dtVisit: Date.parse(dtVisit),
    };

    let checkData = await dbService.findOneRecord("VisitorModel", filter, {
      _id: 1,
    });
    if (checkData) throw new Error(Message.nameAlreadyExists);

    let visitingImageUrl = [];
    if (files.length > 0) {
      visitingImageUrl = await imageUpload(files);
    }

    let payload = {
      vEventId,
      vName,
      dtVisit: Date.parse(dtVisit),
      vMobile1,
      vMobile2,
      vCompanyName,
      vAddress,
      vCityId,
      objEngagesMachine,
      objDealingIn,
      vSampleRequire,
      vRemarks,
      vRepresentedName,
      arrVisitingCardImage: visitingImageUrl,
      vCreatedBy: new ObjectId(userId),
      dtCreatedAt: Date.now(),
    };

    const saveData = await dbService.createOneRecord("VisitorModel", payload);
    if (!saveData) throw new Error(Message.systemError);

    let eventData = await dbService.findOneRecord(
      "EventModel",
      {
        isDeleted: false,
        _id: new ObjectId(vEventId),
      },
      {
        _id: 1,
        vTitle: 1,
      }
    );

    let result = {
      vEventName: eventData?.vTitle,
      vName: saveData?.vName,
      dtVisit: saveData?.dtVisit,
      vMobile1: saveData?.vMobile1,
      vMobile2: saveData?.vMobile2,
      vCompanyName: saveData?.vCompanyName,
      vAddress: saveData?.vAddress,
      objEngagesMachine: saveData?.objEngagesMachine,
      objDealingIn: saveData?.objDealingIn,
      vSampleRequire: saveData?.vSampleRequire,
      vRemarks: saveData?.vRemarks,
      vRepresentedName: saveData?.vRepresentedName,
      arrVisitingCardImage: saveData?.arrVisitingCardImage,
      vCityId: saveData?.vCityId,
    };

    return result;
  } catch (error) {
    console.error("saveError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = save;
