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
const save = require("../../../services/purchaseInward/save");
const list = require("../../../services/purchaseInward/list");
const getDetails = require("../../../services/purchaseInward/getDetails");
const update = require("../../../services/purchaseInward/update");
const deletePurchaseInward = require("../../../services/purchaseInward/delete");

// Upload Image
const imageUpload = multer({ storage: multer.memoryStorage() });

router.post(
  "/details",
  imageUpload.fields([
    { name: "vChallanImage", maxCount: 1 },
    { name: "vLRImage", maxCount: 1 },
    { name: "vInvoiceImage", maxCount: 1 },
    { name: "vEWayBillImage", maxCount: 1 },
  ]),
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
  imageUpload.fields([
    { name: "vChallanImage", maxCount: 1 },
    { name: "vLRImage", maxCount: 1 },
    { name: "vInvoiceImage", maxCount: 1 },
    { name: "vEWayBillImage", maxCount: 1 },
  ]),
  commonResolver.bind({
    modelService: update,
    isRequestValidateRequired: true,
    schemaValidate: updateSchema,
  })
);

router.delete(
  "/details",
  commonResolver.bind({
    modelService: deletePurchaseInward,
    isRequestValidateRequired: true,
    schemaValidate: deleteSchema,
  })
);

module.exports = router;
