const accountSid = process.env.TWILIO_ACCOUNT_SID_2;
const authToken = process.env.TWILIO_AUTH_TOKEN_2;
const client = require("twilio")(accountSid, authToken);
const axios = require("axios");

const sendOTPBySendChamp = async ({ message, mobileNumber }, res) => {
  const template = "655dd2e2d6fc0552f36a3b92";
  const apiKey = "410419AjOX2WrX655dd3e3P1";
  const sendotp =
    "https://api.msg91.com/api/v5/otp?template_id=" +
    template +
    "&mobile=" +
    mobileNumber +
    "&authkey=" +
    apiKey;
  let request_options1 = {
    method: "get",
    url: sendotp,
  };
  let otpResponse = await axios(request_options1);
  console.log(otpResponse.data);
  return otpResponse.data;
};

const sendOTPBySMS = async ({ message, mobileNumber }, res) => {
  try {
    let smsResponse = client.messages
      .create({
        body: message,
        from: "+19855905196",
        to: "+91" + mobileNumber,
      })
      .then((message) => {
        return message.sid;
      })
      .catch((error) => {
        console.log("error---------------->", error);
        return error;
      });
    return smsResponse;
  } catch (error) {
    throw new Error(error?.message);
  }
};

module.exports = { sendOTPBySendChamp, sendOTPBySMS };
