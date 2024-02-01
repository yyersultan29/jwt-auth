import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Forbidden, Unauthorized } from "../utils/Errors.js";

dotenv.config();

class TokenService {
  static async generateAccessToken(payload) {
    return await jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "2m",
    });
  }

  static async generateRefreshToken(payload) {
    return await jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "15d",
    });
  }

  static async checkAccess(req, _, next) {
    const authHeader = req.headers.authorization;

    const token = authHeader?.split(" ")?.[1];

    if (!token) {
      return next(new Unauthorized());
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
      if (error) {
        return next(new Unauthorized(error));
      }
      req.user = user;
      next();
    });
  }

  static async verifyAccessToken(accessToken) {
    return await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  }

  static async verifyRefreshToken(refreshToken) {
    return await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  }
}

export default TokenService;
