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
        vReferenceBy,
        vMobile,
        vCityId,
        vGSTNO,
      },
      file,
    } = entry;

    let checkGstLength = vGSTNO.length;
    let checkNumberLength = vMobile.length;
    if (checkGstLength != 16) {
      throw new Error("Please Enter 16 digit GST NO");
    }
    if (checkNumberLength != 10) {
      throw new Error("Please Enter 10 digit Mobile Number");
    }

    let filter = {
      isDeleted: false,
      vCompanyName,
    };

    let checkData = await dbService.findOneRecord("TransportModel", filter, {
      _id: 1,
      vTransportImage: 1,
    });
    if (checkData) throw new Error(Message.nameAlreadyExists);

    let transportUrlImage = "";
    if (Object.keys(file).length > 0) {
      transportUrlImage = await imageUpload(file);
    }
    let payload = {
      vCompanyName,
      vContactPerson,
      vReferenceBy,
      vMobile,
      vCityId,
      vGSTNO,
      vTransportImage: transportUrlImage,
      vCreatedBy: new ObjectId(userId),
      dtCreatedAt: Date.now(),
    };

    const saveData = await dbService.createOneRecord("TransportModel", payload);
    if (!saveData) throw new Error(Message.systemError);

    let result = {
      vCompanyName: saveData?.vCompanyName,
      vContactPerson: saveData?.vContactPerson,
      vMobile: saveData?.vMobile,
      vReferenceBy: saveData?.vReferenceBy,
      vGSTNO: saveData?.vGSTNO,
      vTransportImage: saveData?.vTransportImage,
      vCityId: saveData?.vCityId,
    };

    return result;
  } catch (error) {
    console.error("saveError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = save;
