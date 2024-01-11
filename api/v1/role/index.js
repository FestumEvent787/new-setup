const { Router } = require("express");
const commonResolver = require("../../../utils/commonResolver");

const router = new Router();

// SCHEMA
const saveSchema = require("./save");

// SERVICES
const save = require("../../../services/role/save");
const list = require("../../../services/role/list");

router.post(
  "/details",
  commonResolver.bind({
    modelService: save,
    isRequestValidateRequired: true,
    schemaValidate: saveSchema,
  })
);

router.get(
  "/details",
  commonResolver.bind({
    modelService: list,
    isRequestValidateRequired: false,
  })
);

module.exports = router;
