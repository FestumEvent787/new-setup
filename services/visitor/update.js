const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");
const imageUpload = require("../../utils/imageUpload");

const update = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: {
        vVisitorId,
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
        isStatus,
        arrVisitorUrlImage = [],
      },
      files,
    } = entry;

    let condition = {
      _id: new ObjectId(vVisitorId),
      isDeleted: false,
    };

    let checkData = await dbService.findOneRecord("VisitorModel", condition, {
      _id: 1,
      arrVisitingCardImage: 1,
    });
    if (!checkData?._id) throw new Error(Message.recordNotFound);

    let visitingImageArray = arrVisitorUrlImage;
    if (files.length > 0) {
      let newImageArray = await imageUpload(files);
      visitingImageArray = visitingImageArray.concat(newImageArray);
    }
    let updateData = {
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
      isStatus,
      arrVisitingCardImage: visitingImageArray,
      isUpdated: true,
      dtUpdatedAt: Date.now(),
      vUpdatedBy: new ObjectId(userId),
    };

    let updateResponse = await dbService.findOneAndUpdateRecord(
      "VisitorModel",
      condition,
      updateData,
      {
        returnOriginal: false,
      }
    );
    if (!updateResponse) throw new Error(Message.systemError);

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
      vName: updateResponse?.vName,
      dtVisit: updateResponse?.dtVisit,
      vMobile1: updateResponse?.vMobile1,
      vMobile2: updateResponse?.vMobile2,
      vCompanyName: updateResponse?.vCompanyName,
      vAddress: updateResponse?.vAddress,
      objEngagesMachine: updateResponse?.objEngagesMachine,
      objDealingIn: updateResponse?.objDealingIn,
      vSampleRequire: updateResponse?.vSampleRequire,
      vRemarks: updateResponse?.vRemarks,
      vRepresentedName: updateResponse?.vRepresentedName,
      arrVisitingCardImage: updateResponse?.arrVisitingCardImage,
      vCityId: updateResponse?.vCityId,
    };

    return result;
  } catch (error) {
    console.error("updateError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = update;
