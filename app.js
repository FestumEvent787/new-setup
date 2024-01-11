require("dotenv").config({ path: "./.env" });
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const db = require("./db/index");
const { failAction } = require("./utils/response");
const helmet = require("helmet");
const routes = require("./api");

const port = process.env.PORT ? process.env.PORT : 7300;
const app = express();

app.use(helmet());

// Access-Control-Allow-Origin
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(
  bodyParser.json({
    limit: "50mb",
  })
);

app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    parameterLimit: 100000,
    extended: true,
  })
);

app.use(express.static(path.join(__dirname, "public")));
app.use("/api", routes);

app.use((err, req, res, next) => {
  if (err && err.error && err.error.isJoi) {
    // we had a joi error, let's return a custom 400 json response
    res
      .status(400)
      .json(failAction(err.error.message.toString().replace(/[\""]+/g, "")));
  } else {
    // pass on to another error handler
    next(err);
  }
});
app.get("/", (req, res) => res.send(`<h1>Adlon App devlop environment</h1>`));

app.listen(port, function () {
  console.log(`Express server listening on port ${port}`);
});
