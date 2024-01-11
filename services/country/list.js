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

    if (!(await dbService.findOneRecord("CountryModel", filter, { _id: 1 })))
      return [];

    let aggregateList = [
      {
        $match: filter,
      },
      {
        $project: {
          _id: 1,
          arrCountryJson: 1,
        },
      },
      { $sort: { _id: -1 } },
    ];

    let dataList = await dbService.aggregateData("CountryModel", aggregateList);

    return dataList;
  } catch (error) {
    console.error("listError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = list;
