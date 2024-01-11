const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const list = async (entry) => {
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
          dtComplainDate: 1,
          dtInvoiceDate: 1,
          vMobile: 1,
          vComplainNote: 1,
          vComplainReview: 1,
          arrComplainPhotos: 1,
          isComplainStatus: 1,
          vCreatedBy: 1,
          vCreatedByName: "$usersData.vName",
          vUpdatedBy: 1,
          dtCreatedAt: 1,
          dtUpdatedAt: 1,
        },
      },
      { $sort: { _id: -1 } },
    ];
    let complainData = await dbService.aggregateData(
      "ComplainModel",
      aggregateQuery
    );
    let totalCount = await dbService.recordsCount("ComplainModel", filter);

    return { data: complainData, iCount: totalCount };
  } catch (error) {
    console.error("listError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = list;
