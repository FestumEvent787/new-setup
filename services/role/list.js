const ObjectId = require("mongodb").ObjectId;
import dbService from "../../utils/dbService.js";
import Message from "../../utils/messages.js";

export const list = async (entry) => {
  try {
    let {
      body: {},
    } = entry;

    let filter = {
      isDeleted: false,
    };

    if (!(await dbService.findOneRecord("RoleModel", filter, { _id: 1 })))
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
      { $sort: { _id: 1 } },
    ];

    let dataList = await dbService.aggregateData("RoleModel", aggregateQuery);
    let totalCount = await dbService.recordsCount("RoleModel", filter);
    if (!dataList) throw new Error(Message.systemError);

    return { data: dataList, iCount: totalCount };
  } catch (error) {
    console.error("listError ----------->", error);
    throw new Error(error?.message);
  }
};
