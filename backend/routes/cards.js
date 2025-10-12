const router = require("express").Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");
const {
  validateCreateCard,
  validateCardIdParam,
} = require("../middlewares/validators");

router.get("/", getCards);
router.post("/", validateCreateCard, createCard);
router.delete("/:cardId", validateCardIdParam, deleteCard);
router.put("/:cardId/likes", validateCardIdParam, likeCard);
router.delete("/:cardId/likes", validateCardIdParam, dislikeCard);

module.exports = router;
