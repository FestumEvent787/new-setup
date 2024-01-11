const Message = require("../../utils/messages");
const dbService = require("../../utils/dbService");
const moment = require("moment-timezone");
const generateJwtTokenFn = require("../../utils/generateJwtTokenFn");

const verifyMobileOtp = async (entry) => {
  try {
    let {
      body: { vOtp, vMobile },
    } = entry;

    let condition = {
      vMobile: vMobile,
      isDeleted: false,
    };

    let userData = await dbService.findOneRecord("UserModel", condition);
    if (!userData) throw new Error(Message.invalidMobile);

    if (userData?.vPhoneOtp !== vOtp) {
      throw new Error(Message.invalidOTP);
    }

    let timezoneOffset =
      moment.tz("America/New_York").format("Z") + "~America/New_York";

    const userDetails = await dbService.findOneAndUpdateRecord(
      "UserModel",
      { _id: userData._id },
      {
        vLoginToken: await generateJwtTokenFn({
          userId: userData["_id"],
          timezoneOffset,
          type: "app",
        }),
        vPhoneOtp: "",
      },
      { new: true }
    );

    return userDetails;
  } catch (error) {
    console.error("verifyMobileOtpError ------------>", error);
    throw new Error(error?.message);
  }
};
module.exports = verifyMobileOtp;
