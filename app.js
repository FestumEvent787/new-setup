import express from "express";

const app = express();
const port = process.env.PORT ? process.env.PORT : 2000;

app.use("/", (req, res) => res.json("server working now......."));

app.listen(port, () => console.log(`Server listening on port ${port}`));
