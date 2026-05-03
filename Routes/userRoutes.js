const Express = require("express");
const ProfileRouter = Express.Router();

const { otpProtected } = require("../middlewares/otpSession");
const userController = require("../controller/userController");
const upload = require("../middlewares/upload");

// CREATE USER (one-time setup, no auth needed)
ProfileRouter.post(
  "/create",
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  userController.createUser,
);

// GET USER — public (anyone can view)
ProfileRouter.get("/", userController.getUser);

// UPDATE USER — owner only (OTP session)
ProfileRouter.put(
  "/",
  otpProtected,
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  userController.updateUser,
);

module.exports = ProfileRouter;
