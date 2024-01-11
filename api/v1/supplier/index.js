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
const save = require("../../../services/supplier/save");
const list = require("../../../services/supplier/list");
const getDetails = require("../../../services/supplier/getDetails");
const update = require("../../../services/supplier/update");
const deleteSupplier = require("../../../services/supplier/delete");

// Upload Image
const imageUpload = multer({ storage: multer.memoryStorage() });

router.post(
  "/details",
  imageUpload.single("vSupplierImage"),
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
    modelService: getDetails,
    isRequestValidateRequired: true,
    schemaValidate: getDetailSchema,
  })
);

router.put(
  "/details",
  imageUpload.single("vSupplierImage"),
  commonResolver.bind({
    modelService: update,
    isRequestValidateRequired: true,
    schemaValidate: updateSchema,
  })
);

router.delete(
  "/details",
  commonResolver.bind({
    modelService: deleteSupplier,
    isRequestValidateRequired: true,
    schemaValidate: deleteSchema,
  })
);

module.exports = router;
