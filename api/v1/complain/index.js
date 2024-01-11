const { Router } = require("express");
const commonResolver = require("../../../utils/commonResolver");
const multer = require("multer");
const router = new Router();

// SCHEMA
const saveSchema = require("./save");
const updateSchema = require("./update");
const deleteSchema = require("./delete");
const getDetailSchema = require("./getDetails");

// SERVICES
const save = require("../../../services/complain/save");
const list = require("../../../services/complain/list");
const getComplainDetails = require("../../../services/complain/getComplainDetails");
const update = require("../../../services/complain/update");
const deleteComplain = require("../../../services/complain/delete");

// Upload Image
const imageUpload = multer({ storage: multer.memoryStorage() });

router.post(
  "/details",
  imageUpload.array("arrComplainPhotos", 10),
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

router.get(
  "/getDetails",
  commonResolver.bind({
    modelService: getComplainDetails,
    isRequestValidateRequired: true,
    schemaValidate: getDetailSchema,
  })
);

router.put(
  "/details",
  imageUpload.array("arrComplainPhotos", 10),
  commonResolver.bind({
    modelService: update,
    isRequestValidateRequired: true,
    schemaValidate: updateSchema,
  })
);

router.delete(
  "/details",
  commonResolver.bind({
    modelService: deleteComplain,
    isRequestValidateRequired: true,
    schemaValidate: deleteSchema,
  })
);

module.exports = router;
