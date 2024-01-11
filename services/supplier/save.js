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
        vContactPersonName,
        vReferenceBy,
        vMobile,
        vEmail,
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
      vEmail: vEmail.toLowerCase(),
    };

    let checkData = await dbService.findOneRecord("SupplierModel", filter, {
      _id: 1,
      vSupplierImage: 1,
    });
    if (checkData) throw new Error(Message.emailAlreadyExists);

    let supplierUrlImage = "";
    if (Object.keys(file).length > 0) {
      supplierUrlImage = await imageUpload(file);
    }

    let payload = {
      vCompanyName,
      vContactPersonName,
      vReferenceBy,
      vMobile,
      vEmail,
      vCityId,
      vGSTNO,
      vSupplierImage: supplierUrlImage,
      vCreatedBy: new ObjectId(userId),
      dtCreatedAt: Date.now(),
    };

    const saveData = await dbService.createOneRecord("SupplierModel", payload);
    if (!saveData) throw new Error(Message.systemError);

    let result = {
      vCompanyName: saveData?.vCompanyName,
      vContactPersonName: saveData?.vContactPersonName,
      vMobile: saveData?.vMobile,
      vReferenceBy: saveData?.vReferenceBy,
      vEmail: saveData?.vEmail,
      vGSTNO: saveData?.vGSTNO,
      vSupplierImage: saveData?.vSupplierImage,
      vCityId: saveData?.vCityId,
    };

    return result;
  } catch (error) {
    console.error("saveError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = save;
