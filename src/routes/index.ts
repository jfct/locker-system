import { Router } from "express";
import bloqRouter from "./bloq.route";
import deliveryRouter from "./delivery.route";
import lockerRouter from "./locker.route";
import rentRouter from "./rent.route";

const apiRouter = Router();

apiRouter.use('/bloq', bloqRouter);
apiRouter.use('/locker', lockerRouter);
apiRouter.use('/rent', rentRouter);
apiRouter.use('/delivery', deliveryRouter);

export default apiRouter;