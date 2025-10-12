const router = require("express").Router();
const {
  getUser, // GET /users
  getUserId, // GET /users/:id
  updateProfile, // PATCH /users/me
  updateAvatar, // PATCH /users/me/avatar
  getCurrentUser, // GET /users/me
} = require("../controllers/users");

router.get("/", getUser);
router.get("/me", getCurrentUser);
router.get("/:id", getUserId);

router.patch("/me", updateProfile);
router.patch("/me/avatar", updateAvatar);

module.exports = router;
