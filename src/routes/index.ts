import { Router } from "express";
import bloqRouter from "./bloq.route";

const apiRouter = Router();

apiRouter.use('/bloq', bloqRouter);

export default apiRouter;