const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const sampleInquiryList = async (entry) => {
  try {
    let {
      body: {},
    } = entry;

    let filter = {
      isDeleted: false,
    };

    let aggregateQuery = [
      {
        $match: filter,
      },
      //tblusers
      {
        $lookup: {
          from: "tblusers",
          localField: "vCreatedBy",
          foreignField: "_id",
          as: "usersData",
        },
      },
      {
        $unwind: {
          path: "$usersData",
          preserveNullAndEmptyArrays: true,
        },
      },
      //tblcustomers
      {
        $lookup: {
          from: "tblcustomers",
          localField: "vCustomerId",
          foreignField: "_id",
          as: "customersData",
        },
      },
      {
        $unwind: {
          path: "$customersData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          vCustomerId: 1,
          vCustomerName: "$customersData.vContactPersonName",
          dtInquiryDate: 1,
          vNotes: 1,
          arrSampleItemDetails: 1,
          vCreatedBy: 1,
          vUpdatedBy: 1,
          vCreatedByName: "$usersData.vName",
          dtCreatedAt: 1,
          dtUpdatedAt: 1,
        },
      },
      { $sort: { _id: -1 } },
    ];
    let dataList = await dbService.aggregateData(
      "SampleInquiryModel",
      aggregateQuery
    );
    let totalCount = await dbService.recordsCount("SampleInquiryModel", filter);

    return { data: dataList, iCount: totalCount };
  } catch (error) {
    console.error("listError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = sampleInquiryList;
