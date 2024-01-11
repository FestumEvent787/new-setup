const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");
const imageUpload = require("../../utils/imageUpload");

const update = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: {
        vIndiaMartId,
        vCompanyName,
        vContactPerson,
        vMobile,
        vAddress,
        vCityId,
        vTraderOrUser,
        vRemark,
        arrIndiaMartLinkImage = [],
      },
      files,
    } = entry;

    let condition = {
      _id: new ObjectId(vIndiaMartId),
      isDeleted: false,
    };

    let checkData = await dbService.findOneRecord("IndiaMartModel", condition, {
      _id: 1,
    });
    if (!checkData?._id) throw new Error(Message.recordNotFound);

    let indiaMartUrlImage = arrIndiaMartLinkImage;
    if (files.length > 0) {
      let newImageArray = await imageUpload(files);
      indiaMartUrlImage = indiaMartUrlImage.concat(newImageArray);
    }

    let updateData = {
      vCompanyName,
      vContactPerson,
      vMobile,
      vAddress,
      vCityId,
      vTraderOrUser,
      vRemark,
      arrIndiaMartImage: indiaMartUrlImage,
      isUpdated: true,
      dtUpdatedAt: Date.now(),
      vUpdatedBy: new ObjectId(userId),
    };

    let updateResponse = await dbService.findOneAndUpdateRecord(
      "IndiaMartModel",
      condition,
      updateData,
      {
        returnOriginal: false,
      }
    );
    if (!updateResponse) throw new Error(Message.systemError);

    let result = {
      vCompanyName: updateResponse?.vCompanyName,
      vContactPerson: updateResponse?.vContactPerson,
      vMobile: updateResponse?.vMobile,
      vAddress: updateResponse?.vAddress,
      vTraderOrUser: updateResponse?.vTraderOrUser,
      vRemark: updateResponse?.vRemark,
      arrIndiaMartImage: updateResponse?.arrIndiaMartImage,
      vCityId: updateResponse?.vCityId,
      dtCreatedAt: updateResponse?.dtCreatedAt,
    };

    return result;
  } catch (error) {
    console.error("updateError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = update;
