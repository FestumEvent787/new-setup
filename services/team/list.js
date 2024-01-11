const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const list = async (entry) => {
  try {
    let {
      user: { _id: userId },
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
          from: "tblroles",
          localField: "vUserRole",
          foreignField: "_id",
          as: "roleData",
        },
      },
      {
        $unwind: {
          path: "$roleData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          vName: 1,
          vAddress: 1,
          vMobile: 1,
          vUserRole: "$roleData.vName",
          vProfileImage: 1,
          vCityId: 1,
        },
      },
      { $sort: { _id: -1 } },
    ];
    let dataList = await dbService.aggregateData("UserModel", aggregateQuery);
    let totalCount = await dbService.recordsCount("UserModel", filter);

    return { data: dataList, iCount: totalCount };
  } catch (error) {
    console.error("listError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = list;
