const { Router } = require("express");
const commonResolver = require("../../../utils/commonResolver");
const router = new Router();

// SCHEMA
const listSchema = require("./list");

// SERVICES
const homeList = require("../../../services/home/list");

router.get(
  "/details",
  commonResolver.bind({
    modelService: homeList,
    isRequestValidateRequired: true,
    schemaValidate: listSchema,
  })
);

module.exports = router;
