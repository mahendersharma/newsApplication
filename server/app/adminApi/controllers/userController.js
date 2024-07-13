import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../../models/userModel.js";
import { uploadOnCloudnary } from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/ApiResponce.js";

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontent for uses register
  const { name, email, password, userName } = req.body || {};

  if ([name, email, password, userName].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All Field are required");
  }

  const exitedUser = await User.findOne({
    $or: [{ userName }, { email }]
  })

  if (exitedUser) {
    throw new ApiError(409, "user With email or username alredy Exit");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path

  if(!avatarLocalPath){
    throw new ApiError(400, "Avatar is required");
  }

  const avatars= await uploadOnCloudnary(avatarLocalPath)

  if(!avatars){
    throw new ApiError(400, "Avatar is required");
  }

const user = await User.create({
    name,
    avatar:avatars.url,
    email,
    password,
    userName:userName.toLowerCase()
  })

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
)
if (!createdUser) {
  throw new ApiError(500, "Something went wrong while registering the user")
}

return res.status(201).json(
  new ApiResponse(200, createdUser, "User registered Successfully")
)

}
);

export { registerUser };
