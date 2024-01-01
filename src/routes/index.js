import { Router } from "express";
import authRoute from "./authRoute.js";
import userRoute from "./userRoute.js";

export default Router().use([authRoute, userRoute]);
