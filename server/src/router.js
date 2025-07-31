//third-party
import { Router } from "express";
//local
import home from "./controllers/home-controller.js";
import userController from "./controllers/user-controller.js";
import boardController from "./controllers/board-controller.js";

const routes = Router()

routes.use(home)
routes.use("/users", userController)
routes.use("/boards", boardController)

export default routes