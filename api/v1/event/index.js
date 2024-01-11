const { Router } = require("express");
const commonResolver = require("../../../utils/commonResolver");
const multer = require("multer");
const router = new Router();

// SCHEMA
const saveSchema = require("./save");
const updateSchema = require("./update");
const deleteSchema = require("./delete");
const getDetailSchema = require("./getDetails");
const listSchema = require("./list");

// SERVICES
const save = require("../../../services/event/save");
const list = require("../../../services/event/list");
const getDetails = require("../../../services/event/getDetails");
const update = require("../../../services/event/update");
const deleteEvent = require("../../../services/event/delete");

// Upload Image
const imageUpload = multer({ storage: multer.memoryStorage() });

router.post(
  "/details",
  imageUpload.single("vEventImage"),
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
    isRequestValidateRequired: true,
    schemaValidate: listSchema,
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
  imageUpload.single("vEventImage"),
  commonResolver.bind({
    modelService: update,
    isRequestValidateRequired: true,
    schemaValidate: updateSchema,
  })
);

router.delete(
  "/details",
  commonResolver.bind({
    modelService: deleteEvent,
    isRequestValidateRequired: true,
    schemaValidate: deleteSchema,
  })
);

module.exports = router;
