const { Router } = require("express");

// Start Permission Middleware//
const userAuthentication = require("../../middleware/authentication/userAuthentication");

// End Permission Middleware //
const userRouter = require("./user/index");
const supplierRouter = require("./supplier/index");
const customerRouter = require("./customer/index");
const transportRouter = require("./transport/index");
const productTypeRouter = require("./productType/index");
const productQualityRouter = require("./productQuality/index");
const productColorRouter = require("./productColor/index");
const productDenierRouter = require("./productDenier/index");
const packingRouter = require("./packing/index");
const eventRouter = require("./event/index");
const visitorRouter = require("./visitor/index");
const settingRouter = require("./settings/index");
const roleRouter = require("./role/index");
const teamRouter = require("./team/index");
const indiaMartRouter = require("./indiaMart/index");
const purchaseOrderRouter = require("./purchaseOrder/index");
const purchaseInwardRouter = require("./purchaseInward/index");
const purchaseReturnRouter = require("./purchaseReturn/index");
const salesOrderRouter = require("./salesOrder/index");
const deliveryChallanRouter = require("./deliveryChallan/index");
const salesReturnRouter = require("./salesReturn/index");
const countryRouter = require("./country/index");
const stockRouter = require("./stock/index");
const sampleInquiryRouter = require("./sampleInquiry/index");
const complainRouter = require("./complain/index");
const homeRouter = require("./home/index");
const productReportRouter = require("./productReport/index");

const app = Router();

/*********** Combine all Routes ********************/

app.use("/user", userRouter);
app.use("/supplier", userAuthentication.bind({}), supplierRouter);
app.use("/customer", userAuthentication.bind({}), customerRouter);
app.use("/transport", userAuthentication.bind({}), transportRouter);
app.use("/productType", userAuthentication.bind({}), productTypeRouter);
app.use("/productQuality", userAuthentication.bind({}), productQualityRouter);
app.use("/productColor", userAuthentication.bind({}), productColorRouter);
app.use("/productDenier", userAuthentication.bind({}), productDenierRouter);
app.use("/packing", userAuthentication.bind({}), packingRouter);
app.use("/event", userAuthentication.bind({}), eventRouter);
app.use("/visitor", userAuthentication.bind({}), visitorRouter);
app.use("/setting", userAuthentication.bind({}), settingRouter);
app.use("/role", userAuthentication.bind({}), roleRouter);
app.use("/team", userAuthentication.bind({}), teamRouter);
app.use("/indiaMart", userAuthentication.bind({}), indiaMartRouter);
app.use("/purchaseOrder", userAuthentication.bind({}), purchaseOrderRouter);
// app.use("/purchaseOrder", purchaseOrderRouter);
app.use("/purchaseInward", userAuthentication.bind({}), purchaseInwardRouter);
app.use("/purchaseReturn", userAuthentication.bind({}), purchaseReturnRouter);
app.use("/salesOrder", userAuthentication.bind({}), salesOrderRouter);
app.use("/deliveryChallan", userAuthentication.bind({}), deliveryChallanRouter);
app.use("/salesReturn", userAuthentication.bind({}), salesReturnRouter);
app.use("/country", userAuthentication.bind({}), countryRouter);
app.use("/stock", userAuthentication.bind({}), stockRouter);
app.use("/sampleInquiry", userAuthentication.bind({}), sampleInquiryRouter);
app.use("/complain", userAuthentication.bind({}), complainRouter);
app.use("/home", userAuthentication.bind({}), homeRouter);
app.use("/productReport", userAuthentication.bind({}), productReportRouter);

module.exports = app;
