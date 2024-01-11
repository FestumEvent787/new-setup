const ObjectId = require("mongodb").ObjectId;
const dbService = require("../../utils/dbService");
const Message = require("../../utils/messages");
const indiaMartList = require("../indiaMart/list");
const sampleInquiryList = require("../sampleInquiry/list");

const getAllDetails = async (entry) => {
  try {
    let {
      body: { vType = "indiaMart" },
    } = entry;

    let result = [];
    if (vType == "indiaMart") {
      result = await indiaMartList({ body: {} });
    } else {
      result = await sampleInquiryList({ body: {} });
    }

    return result;
  } catch (error) {
    console.error("listError ----------->", error);
    throw new Error(error?.message);
  }
};

module.exports = getAllDetails;
