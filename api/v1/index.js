import { Router } from "express";

// End Permission Middleware //
import roleRouter from "./role";

const app = Router();

/*********** Combine all Routes ********************/

app.use("/role", roleRouter);

export default app;
