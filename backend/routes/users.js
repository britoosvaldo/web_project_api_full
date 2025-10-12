const router = require("express").Router();
const {
  getUsers,
  getUserById,
  getCurrentUser,
  updateUser,
  updateAvatar,
} = require("../controllers/users");
const {
  validateUserIdParam,
  validateUserUpdate,
  validateAvatarUpdate,
} = require("../middlewares/validators");

router.get("/", getUsers);
router.get("/me", getCurrentUser);
router.get("/:userId", validateUserIdParam, getUserById);
router.patch("/me", validateUserUpdate, updateUser);
router.patch("/me/avatar", validateAvatarUpdate, updateAvatar);

module.exports = router;
