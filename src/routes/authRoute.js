import { Router } from "express";
import authController from "../controller/auth.controller.js";

export default new Router()
  .post("/register", authController.register)
  .get("/confirm/:email/:token", authController.confirm)
  .post("/login", authController.login);
