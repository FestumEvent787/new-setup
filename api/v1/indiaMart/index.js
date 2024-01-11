const { Router } = require("express");
const commonResolver = require("../../../utils/commonResolver");
const multer = require("multer");
const router = new Router();

// SCHEMA
const saveSchema = require("./save");
const updateSchema = require("./update");
const deleteSchema = require("./delete");
const getDetailSchema = require("./getDetails");
const getAllDetailSchema = require("./getAllDetail");

// SERVICES
const save = require("../../../services/indiaMart/save");
const indiaMartList = require("../../../services/indiaMart/list");
const getAllDetails = require("../../../services/indiaMart/getAllDetails");
const getDetails = require("../../../services/indiaMart/getDetails");
const update = require("../../../services/indiaMart/update");
const deleteIndiaMart = require("../../../services/indiaMart/delete");

// Upload Image
const imageUpload = multer({ storage: multer.memoryStorage() });

router.post(
  "/details",
  imageUpload.array("arrIndiaMartImage"),
  commonResolver.bind({
    modelService: save,
    isRequestValidateRequired: true,
    schemaValidate: saveSchema,
  })
);

router.get(
  "/details",
  commonResolver.bind({
    modelService: indiaMartList,
    isRequestValidateRequired: false,
  })
);

router.get(
  "/getAllDetails",
  commonResolver.bind({
    modelService: getAllDetails,
    isRequestValidateRequired: true,
    schemaValidate: getAllDetailSchema,
  })
);

router.get(
  "/getDetails",
  commonResolver.bind({
    modelService: getDetails,
    isRequestValidateRequired: true,
    schemaValidate: getDetailSchema,
  })
);

router.put(
  "/details",
  imageUpload.array("arrIndiaMartImage"),
  commonResolver.bind({
    modelService: update,
    isRequestValidateRequired: true,
    schemaValidate: updateSchema,
  })
);

router.delete(
  "/details",
  commonResolver.bind({
    modelService: deleteIndiaMart,
    isRequestValidateRequired: true,
    schemaValidate: deleteSchema,
  })
);

module.exports = router;
