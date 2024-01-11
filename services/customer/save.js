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
      vContactPersonName,
    };

    let checkData = await dbService.findOneRecord("CustomerModel", filter, {
      _id: 1,
    });
    if (checkData) throw new Error(Message.nameAlreadyExists);

    let customerUrlImage = "";
    if (Object.keys(file).length > 0) {
      customerUrlImage = await imageUpload(file);
    }

    let payload = {
      vCompanyName,
      vContactPersonName,
      vReferenceBy,
      vMobile,
      vCityId,
      vGSTNO,
      vCustomerImage: customerUrlImage,
      vCreatedBy: new ObjectId(userId),
      dtCreatedAt: Date.now(),
    };

    const customerData = await dbService.createOneRecord(
      "CustomerModel",
      payload
    );
    if (!customerData) throw new Error(Message.systemError);

    let result = {
      vCompanyName: customerData?.vCompanyName,
      vContactPersonName: customerData?.vContactPersonName,
      vReferenceBy: customerData?.vReferenceBy,
      vCustomerImage: customerUrlImage,
      vMobile: customerData?.vMobile,
      vCityId: customerData?.vCityId,
      vGSTNO: customerData?.vGSTNO,
    };

    return result;
  } catch (error) {
    console.error("saveError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = save;
