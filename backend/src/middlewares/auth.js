import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import catchAsync from "../utils/catchAsync.js";
import ErrorHandler from "../utils/errorHandler.js";
import { removeHash } from "../utils/password.js";

export const isAuthenticatedUser = catchAsync(async (req, res, next) => {
  let token = req.cookies.jwttoken;

  // Also check Authorization header if cookie is not present
  if (!token && req.headers.authorization) {
    token = req.headers.authorization.replace('Bearer ', '');
  }

  if (!token) {
    return next(new ErrorHandler("Please login to access the resource", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);

  req.user = await User.findById(decodedData._id);

  req.user = removeHash(req.user);

  next();
});

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }

    next();
  };
};
