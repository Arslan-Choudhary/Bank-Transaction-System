import ENV from "#env";
import { UserRepository } from "#repository";
import { ResponseHandler } from "#utils";
import jwt from "jsonwebtoken";

export async function authMiddleware(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    ResponseHandler.authHandler(res, "Unauthorized access, token is missing");
  }

  const isBlackListed = await UserRepository.FindToken(token);

  if (isBlackListed) {
    ResponseHandler.authHandler(res, "Unauthorized access, token is Invalid");
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET);

    const user = await UserRepository.FindUserById(decoded._id);

    if (!user) {
      ResponseHandler.authHandler(res, "User not exists with this token", 404);
    }

    req.user = user;

    return next();
  } catch (error) {
    ResponseHandler.authHandler(res, "Unauthorized access, token is invalid");
  }
}

export async function authSystemUserMiddleware(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    ResponseHandler.authHandler(res, "Unauthorized access, token is missing");
  }

  const isBlackListed = await UserRepository.FindToken(token);

  if (isBlackListed) {
    ResponseHandler.authHandler(res, "Unauthorized access, token is Invalid");
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET);

    const user = await UserRepository.FindUserById(decoded._id, "+systemUser");

    if (!user.systemUser) {
      ResponseHandler.authHandler(
        res,
        "Forbidden access, not a system user",
        403,
      );
    }

    req.user = user;

    return next();
  } catch (error) {
    ResponseHandler.authHandler(
      res,
      "Unauthorized access, token is invalid",
      401,
    );
  }
}
