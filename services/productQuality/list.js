const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const list = async (entry) => {
  try {
    let {
      body: { vProductQualityId },
    } = entry;

    let filter = {
      isDeleted: false,
    };

    if (
      !(await dbService.findOneRecord("ProductQualityModel", filter, {
        _id: 1,
      }))
    )
      return [];

    let aggregateQuery = [
      {
        $match: filter,
      },
      {
        $project: {
          _id: 1,
          vName: 1,
        },
      },
      { $sort: { _id: -1 } },
    ];

    let dataList = await dbService.aggregateData(
      "ProductQualityModel",
      aggregateQuery
    );
    let totalCount = await dbService.recordsCount(
      "ProductQualityModel",
      filter
    );
    if (!dataList) throw new Error(Message.systemError);

    return { data: dataList, iCount: totalCount };
  } catch (error) {
    console.error("listError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = list;
