import { failAction } from "./response";
import jwt from "jsonwebtoken";

const jwtAlgo = process.env.JWT_ALGO;
const jwtKey = process.env.JWT_KEY;
export const generateJwtTokenFn = async (userIdObj) => {
  return new Promise((resolve, reject) => {
    jwt.sign(userIdObj, jwtKey, { expiresIn: "365d" }, function (err, encode) {
      if (err) {
        return failAction(err, 401);
      } else {
        resolve(encode);
      }
    });
  });
};
