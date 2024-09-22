import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../../models/userModel.js";
import { uploadOnCloudnary } from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/ApiResponce.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.genrateAccessToken();
    const refreshToken = user.genrateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontent for uses register
  console.log("hello",req.body)
  const { name, email, password, userName } = req.body || {};
  if ([name, email, password, userName].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All Field are required");
  }

  const exitedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (exitedUser) {
    throw new ApiError(409, "user With email or username alredy Exit");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatars = await uploadOnCloudnary(avatarLocalPath);

  if (!avatars) {
    throw new ApiError(400, "Avatar is required");
  }

  const user = await User.create({
    name,
    avatar: avatars.url,
    email,
    password,
    userName: userName?.toLowerCase() || "",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, userName, password } = req.body; // Changed username to userName

  // Validate input: either userName or email is required
  if (!userName && !email) {
    throw new ApiError(400, "User name or email is required");
  }

  console.log("Searching for user with:", { userName, email });

  // Find the user by either userName or email
  const user = await User.findOne({
    $or: [{ userName }, { email }],
  });

  // Check if user exists
  if (!user) {
    console.log("User not found with:", { userName, email });
    throw new ApiError(404, "User does not exist");
  }

  // Validate password
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    console.log("Password mismatch for user:", user.userName || user.email);
    throw new ApiError(401, "Invalid user credentials");
  }

  // Generate access and refresh tokens
  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

  // Select user fields to return (excluding password and refresh token)
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  // Cookie options
  const options = {
    httpOnly: true, // Prevents client-side access to the cookie
    secure: true,   // Ensure cookies are sent over HTTPS
  };

  // Send response with cookies and user info
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});




const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshAccessToken;

    if (!incomingRefreshToken) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "invalid Refresh Token");
    }

    if (user?.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "Refresh Token is expired");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, newRefreshToken } =
      await generateAccessAndRefereshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken: newRefreshToken,
          },
          "Access token Successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassWord } = req.body || {};

  console.log("ol", req.body)

  const user = await User.findById(req.user?._id);
  // console.log("user",user)

  const isPasswordCorrects = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrects) {
    throw new ApiError(400, "Invalid old Password");
  }
  user.password = newPassWord;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password Changed SuccessFully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current User Fetch successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { name, email } = req.body || {};

  if (!name || !email) {
    throw new ApiError(400, "All Field Are Required");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        name,
        email: email,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Update Account Detailes Successfully "));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.files?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar files is missing");
  }

  const avatar = await uploadOnCloudnary(avatarLocalPath);
  if (!avatar.url) {
    throw new ApiError(400, " Error while Avatar uploading ");
  }
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    {
      new: true,
    }
  ).select("-password");

return res.status(200)
.json(new ApiResponse(200,avatar,"Avatar Images chanage Successfully"))
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar
};
