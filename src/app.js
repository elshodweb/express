import Express from "express";
import routes from "./routes/index.js";
import errorsHandling from "./middleware/error.js";
import { createClient } from "redis";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
const app = Express();
export const clientRedis = await createClient()
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();
app.use(cookieParser());
app.use(Express.json());
app.use(fileUpload());
app.use(routes);

app.use(errorsHandling);

app.listen(9090, console.log(9090));
