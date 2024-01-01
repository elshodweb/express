import Joi from "joi";
import pg from "../model/pg.js";
import { usersQuery } from "../model/queries.js";
import Exception from "../exception/exception.js";
import { hash, verify } from "../utils/jwt.js";
import imageName from "../utils/imageName.js";
import { crypt } from "../utils/bcript.js";
import path from "path";

const schema = Joi.object({
  name: Joi.string().required().min(3).max(12),
  firstname: Joi.string().required().min(3).max(12),
  password: Joi.string().required().min(6).max(16),
  email: Joi.string().required().email(),
});

export default {
  async getSelf(req, res, next) {
    const { token } = req.cookies;

    if (!token) {
      return next(new Exception("Token have not been sent", 400));
    }

    const payload = await verify(token);

    if (payload.message) {
      return next(new Exception(payload.message, 400));
    }

    const val = await pg(usersQuery.getSelf, payload);

    if (val.message) {
      return next(new Exception(val.message, 400));
    }

    const { id, ...user } = { ...val?.[0] };

    if (val?.[0]) {
      return res.json(user);
    } else {
      return next(new Exception("user was not founded", 401));
    }
  },
  async get(req, res, next) {
    let val = await pg(usersQuery.get);
    return res.json(val);
  },
  async update(req, res, next) {
    let { name, firstname, password, email } = req.body;
    let { image } = req.files;
    let { id } = req.params;

    password = await crypt(password);

    let nameImg = imageName(image.mimetype);

    let val = await pg(
      usersQuery.update,
      name,
      firstname,
      password,
      email,
      nameImg,
      id
    );

    if (val.message) {
      return next(new Exception(val.message, 400));
    }

    image.mv(path.resolve("src", "uploads", nameImg));

    return res.json(val);
  },
};
