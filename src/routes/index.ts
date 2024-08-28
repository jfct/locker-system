import { Router } from "express";
import bloqRouter from "./bloq.route";
import lockerRouter from "./locker.route";
import rentRouter from "./rent.route";

const apiRouter = Router();

apiRouter.use('/bloq', bloqRouter);
apiRouter.use('/locker', lockerRouter);
apiRouter.use('/rent', rentRouter);

export default apiRouter;