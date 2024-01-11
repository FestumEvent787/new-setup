const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");

const customerWiseReport = async (entry) => {
  try {
    let {
      user: { _id: userId },
      body: { vComplainId },
    } = entry;

    return [];
  } catch (error) {
    console.error("customerWiseReportError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = customerWiseReport;
