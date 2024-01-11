const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const save = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: { vCustomerId, dtInquiryDate, vNotes, arrSampleItemDetails },
    } = entry;

    let userData = await dbService.findOneRecord(
      "UserModel",
      {
        _id: new ObjectId(userId),
        isDeleted: false,
      },
      {
        _id: 1,
        vName: 1,
      }
    );

    let sampleInquiryDetailsArray = [];
    arrSampleItemDetails.forEach((element) => {
      let obj = {
        vProductTypeId: new ObjectId(element?.vProductTypeId),
        vProductQualityId: new ObjectId(element?.vProductQualityId),
        vProductColorId: new ObjectId(element?.vProductColorId),
        vProductDenierId: new ObjectId(element?.vProductDenierId),
        vPackingId: new ObjectId(element?.vPackingId),
        vNotes: element?.vNotes,
      };
      sampleInquiryDetailsArray.push(obj);
    });

    const saveData = await dbService.createOneRecord("SampleInquiryModel", {
      vCustomerId: new ObjectId(vCustomerId),
      dtInquiryDate: Date.parse(dtInquiryDate),
      vNotes,
      arrSampleItemDetails: sampleInquiryDetailsArray,
      vCreatedBy: new ObjectId(userId),
      dtCreatedAt: Date.now(),
    });
    if (!saveData) throw new Error(Message.systemError);

    let customerData = await dbService.findOneRecord(
      "CustomerModel",
      {
        _id: new ObjectId(saveData?.vCustomerId),
        isDeleted: false,
      },
      {
        _id: 1,
        vContactPersonName: 1,
      }
    );

    let result = {
      vCustomerId: saveData?.vCustomerId,
      vCustomerName: customerData?.vContactPersonName,
      dtInquiryDate: saveData?.dtInquiryDate,
      vNotes: saveData?.vNotes,
      arrSampleItemDetails: saveData?.arrSampleItemDetails,
      vCreatedBy: saveData?.vCreatedBy,
      vCreatedByName: userData?.vName,
    };

    return result;
  } catch (error) {
    console.error("saveError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = save;
