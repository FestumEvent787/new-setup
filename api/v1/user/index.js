const { Router } = require("express");
const commonResolver = require("../../../utils/commonResolver");
const userAuthentication = require("../../../middleware/authentication/userAuthentication");

const router = new Router();

// SCHEMA
const loginSchema = require(".//login");
const mobileOtpSchema = require("./mobileOtp");
const userListSchema = require("./userList");

// SERVICES
const onLogin = require("../../../services/user/login");
const verifyMobileOtp = require("../../../services/user/verifyMobileOtp");
const userList = require("../../../services/user/userList");

router.post(
  "/login",
  commonResolver.bind({
    modelService: onLogin,
    isRequestValidateRequired: true,
    schemaValidate: loginSchema,
  })
);

router.post(
  "/verifyMobileOtp",
  commonResolver.bind({
    modelService: verifyMobileOtp,
    isRequestValidateRequired: true,
    schemaValidate: mobileOtpSchema,
  })
);

router.post(
  "/allUserList",
  commonResolver.bind({
    modelService: userList,
    isRequestValidateRequired: true,
    schemaValidate: userListSchema,
  })
);

module.exports = router;
