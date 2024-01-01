import Joi from "joi";
import Exception from "../exception/exception.js";
import pg from "../model/pg.js";
import { authQuery } from "../model/queries.js";
import { hash } from "../utils/jwt.js";
import { compair, crypt } from "../utils/bcript.js";
import { clientRedis } from "../app.js";
import generateConfirmationCode from "../utils/generateCode.js";
import { mailer } from "../utils/nodemailer.js";
const schema = Joi.object({
  name: Joi.string().required().min(3).max(12),
  firstname: Joi.string().required().min(3).max(12),
  password: Joi.string().required().min(6).max(16),
  email: Joi.string().required().email(),
});

const schemaLogin = Joi.object({
  password: Joi.string().required().min(6).max(16),
  email: Joi.string().required().email(),
});

export default {
  async register(req, res, next) {
    let { name, firstname, password, email } = req.body;

    const { error, value } = schema.validate({
      name,
      firstname,
      password,
      email,
    });
    password = await crypt(password);
    if (error) {
      return next(new Exception(error.message, 401));
    }

    const val = await pg(authQuery.register, name, firstname, password, email);

    if (val.message) {
      return next(new Exception(val.message, 400));
    }
    let code = generateConfirmationCode();
    // set code to redis
    clientRedis.set(email, code, "EX", 10);
    const url = `${req.protocol}://${req.get("host")}/confirm/${email}/${code}`;
    await mailer(email, url);

    if (val?.[0]) {
      res.cookie("token", hash(val[0].id));
      return res.json({
        status: 200,
        message: "OK",
      });
    } else {
      return next(new Exception("wrong email or password", 400));
    }
  },

  async confirm(req, res, next) {
    const { email, token } = req.params;

    let storedCode = await clientRedis.get(email).catch((err) => {
      if (err) {
        return next(new Exception(err.message));
      }
    });

    if (token === storedCode) {
      await pg(authQuery.confirm, email);
      await clientRedis.del(email);
      return res.json("Email confirmed successfully!");
    } else {
      return next(new Exception("Invalid confirmation code"));
    }
  },

  async login(req, res, next) {
    const { email, password } = req.body;

    const { error } = schemaLogin.validate({ email, password });

    if (error) {
      return next(new Exception(error.message, 400));
    }

    const val = await pg(authQuery.login, email);

    if (val.message) {
      return next(new Exception(val.message, 400));
    }

    if (val?.[0] && (await compair(password, val?.[0]?.password))) {
      res.cookie("token", hash(val[0].id));
      return res.json({
        status: 200,
        message: "OK",
      });
    } else {
      return next(new Exception("wrong email or password", 400));
    }
  },
};
