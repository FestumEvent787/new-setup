const { Router } = require("express");
const commonResolver = require("../../../utils/commonResolver");
const router = new Router();

// SCHEMA
const productWiseReportSchema = require("./productWiseReport");
const salesReportSchema = require("./salesReport");
const customerReportSchema = require("./customerReport");
const stockReportSchema = require("./stockReport");

// SERVICES
const productWiseReport = require("../../../services/productReport/productWiseReport");
const salesWiseReport = require("../../../services/productReport/salesWiseReport");
const customerWiseReport = require("../../../services/productReport/customerWiseReport");
const stockWiseReport = require("../../../services/productReport/stockWiseReport");

router.post(
  "/productReport",
  commonResolver.bind({
    modelService: productWiseReport,
    isRequestValidateRequired: true,
    schemaValidate: productWiseReportSchema,
  })
);

router.post(
  "/salesReport",
  commonResolver.bind({
    modelService: salesWiseReport,
    isRequestValidateRequired: true,
    schemaValidate: salesReportSchema,
  })
);

router.post(
  "/customerReport",
  commonResolver.bind({
    modelService: customerWiseReport,
    isRequestValidateRequired: true,
    schemaValidate: customerReportSchema,
  })
);

router.post(
  "/stockReport",
  commonResolver.bind({
    modelService: stockWiseReport,
    isRequestValidateRequired: true,
    schemaValidate: stockReportSchema,
  })
);

module.exports = router;
