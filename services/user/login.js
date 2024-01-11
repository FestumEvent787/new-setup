const Message = require("../../utils/messages");
const dbService = require("../../utils/dbService");
const { generateRandom } = require("../../utils/generateRandom");

const onLogin = async (entry, res) => {
  try {
    let {
      body: { vMobile },
    } = entry;

    let condition = {
      vMobile: vMobile,
      isDeleted: false,
    };

    let userData = await dbService.findOneRecord("UserModel", condition);
    if (!userData) throw new Error(Message.invalidMobile);

    // generate otp
    const verificationCode = await generateRandom(4, false);

    let updateData = { vPhoneOtp: verificationCode };
    let updateResponse = await dbService.findOneAndUpdateRecord(
      "UserModel",
      condition,
      updateData,
      {
        returnOriginal: false,
      }
    );

    // let sendSMSResponse2 = await sendOTPBySMS({
    //   message: `Your verification code is: ${verificationCode}`,
    //   mobileNumber: vMobile,
    // });

    // if (sendSMSResponse2) {
    //   return { vPhoneOtp: verificationCode };
    // } else {
    //   return [];
    // }

    return { vPhoneOtp: verificationCode };
  } catch (error) {
    console.error("onLoginError ----------->", error);
    throw new Error(error?.message);
  }
};
module.exports = onLogin;
