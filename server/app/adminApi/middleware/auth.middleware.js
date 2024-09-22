import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import User from "../../models/userModel.js";

export const jwtVerify = asyncHandler(async (req, _, next) => {
  console.log("token")
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    console.log(token)
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }
    const decodedToken = await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiError(401, "invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401,error?.message || "invalid Access Tokens")
  }
});
