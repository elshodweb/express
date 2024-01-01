import { Router } from "express";
import userController from "../controller/user.controller.js";

const router = Router();

router
  .get("/getSelf", userController.getSelf)
  .get("/all", userController.get)
  .post("/update/:id", userController.update);

export default router;
