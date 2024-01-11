const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const update = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: {
        vSampleInquiryId,
        vCustomerId,
        dtInquiryDate,
        vNotes,
        arrSampleItemDetails,
      },
    } = entry;

    let condition = {
      _id: new ObjectId(vSampleInquiryId),
      isDeleted: false,
    };

    let checkData = await dbService.findOneRecord(
      "SampleInquiryModel",
      condition,
      {
        _id: 1,
      }
    );
    if (!checkData?._id) throw new Error(Message.recordNotFound);

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

    let updateData = {
      vCustomerId: new ObjectId(vCustomerId),
      dtInquiryDate: Date.parse(dtInquiryDate),
      vNotes,
      arrSampleItemDetails: sampleInquiryDetailsArray,
      isUpdated: true,
      dtUpdatedAt: Date.now(),
      vUpdatedBy: new ObjectId(userId),
    };

    let updateResponse = await dbService.findOneAndUpdateRecord(
      "SampleInquiryModel",
      condition,
      updateData,
      {
        returnOriginal: false,
      }
    );
    if (!updateResponse) throw new Error(Message.systemError);

    let customerData = await dbService.findOneRecord(
      "CustomerModel",
      {
        _id: new ObjectId(updateResponse?.vCustomerId),
        isDeleted: false,
      },
      {
        _id: 1,
        vContactPersonName: 1,
      }
    );

    let userData = await dbService.findOneRecord(
      "UserModel",
      {
        _id: new ObjectId(updateResponse?.vUpdatedBy),
        isDeleted: false,
      },
      {
        _id: 1,
        vName: 1,
      }
    );

    let result = {
      vCustomerId: updateResponse?.vCustomerId,
      vCustomerName: customerData?.vContactPersonName,
      dtInquiryDate: updateResponse?.dtInquiryDate,
      vNotes: updateResponse?.vNotes,
      arrSampleItemDetails: updateResponse?.arrSampleItemDetails,
      vCreatedBy: updateResponse?.vCreatedBy,
      vUpdatedBy: updateResponse?.vUpdatedBy,
      vCreatedByName: userData?.vName,
    };

    return result;
  } catch (error) {
    console.error("updateError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = update;
