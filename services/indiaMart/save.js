const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");
const imageUpload = require("../../utils/imageUpload");

const save = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: {
        vCompanyName,
        vContactPerson,
        vMobile,
        vAddress,
        vCityId,
        vTraderOrUser,
        vRemark,
      },
      files,
    } = entry;

    let filter = {
      isDeleted: false,
      vCompanyName,
    };

    let checkData = await dbService.findOneRecord("IndiaMartModel", filter, {
      _id: 1,
    });
    if (checkData) throw new Error(Message.nameAlreadyExists);

    let indiaMartUrlImage = [];
    if (files.length > 0) {
      indiaMartUrlImage = await imageUpload(files);
    }

    let payload = {
      vCompanyName,
      vContactPerson,
      vMobile,
      vAddress,
      vCityId,
      vTraderOrUser,
      vRemark,
      arrIndiaMartImage: indiaMartUrlImage,
      vCreatedBy: new ObjectId(userId),
      dtCreatedAt: Date.now(),
    };

    const saveData = await dbService.createOneRecord("IndiaMartModel", payload);
    if (!saveData) throw new Error(Message.systemError);

    let result = {
      _id: saveData?._id,
      vCompanyName: saveData?.vCompanyName,
      vContactPerson: saveData?.vContactPerson,
      vMobile: saveData?.vMobile,
      vAddress: saveData?.vAddress,
      vTraderOrUser: saveData?.vTraderOrUser,
      vRemark: saveData?.vRemark,
      arrIndiaMartImage: saveData?.arrIndiaMartImage,
      vCityId: saveData?.vCityId,
      dtCreatedAt: saveData?.dtCreatedAt,
    };

    return result;
  } catch (error) {
    console.error("saveError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = save;
