//third-party
import { Router } from "express";
//local
import userController from "./controllers/user-controller.js";
import boardController from "./controllers/board-controller.js";

const routes = Router()

routes.use("/users", userController)
routes.use("/catalog", boardController)

export default routes