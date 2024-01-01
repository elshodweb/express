import jwt from "jsonwebtoken";
import "dotenv/config";

export const hash = (value) => {
  return jwt.sign(value, process.env.JWT_SECRET_KEY);
};

export const verify = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET_KEY, function (err, decoded) {
    if (err) {
      return err;
    }
    return decoded;
  });
};
