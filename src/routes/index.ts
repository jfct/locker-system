import { Router } from "express";
import bloqRouter from "./bloq.route";
import lockerRouter from "./locker.route";

const apiRouter = Router();

apiRouter.use('/bloq', bloqRouter);
apiRouter.use('/locker', lockerRouter);

export default apiRouter;