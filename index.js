// require("rootpath")();
// require("dotenv").config({ path: "./.env" });
// require("./server.js");

// require("dotenv").config({ path: ".env" });
import express from "express";
// import bodyParser from "body-parser";
// import cors from "cors";
// import path from "path";
// import db from "./db/index.js";
// import { failAction } from "./utils/response";
// import http from "http";
// import helmet from "helmet";

import routes from "./api";

const app = express();
const port = process.env.PORT ? process.env.PORT : 2000;

// app.use(helmet());

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// Access-Control-Allow-Origin
// app.use(
//   cors({
//     origin: "*",
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//     credentials: true,
//   })
// );

app.use("/", (req, res) =>
  res.json({ message: "Hello Server Now Working......." })
);
app.use("/api", routes);

app.listen(port, () => console.log(`Server listening on port ${port}`));
