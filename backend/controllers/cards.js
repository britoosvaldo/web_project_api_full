const Card = require("../models/cards");

// GET /cards
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: "Erro no servidor" }));
};

// POST /cards
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError")
        return res.status(400).send({ message: "Dados inválidos" });
      return res.status(500).send({ message: "Erro no servidor" });
    });
};

// DELETE /cards/:cardId
module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card)
        return res.status(404).send({ message: "Cartão não encontrado" });
      if (String(card.owner) !== String(req.user._id)) {
        return res
          .status(403)
          .send({
            message: "Acesso negado: você não pode remover este cartão",
          });
      }
      return Card.deleteOne({ _id: cardId }).then(() =>
        res.send({ message: "Cartão deletado com sucesso" })
      );
    })
    .catch((err) => {
      if (err.name === "CastError")
        return res.status(400).send({ message: "ID de cartão inválido" });
      return res.status(500).send({ message: "Erro no servidor" });
    });
};

// PUT /cards/:cardId/likes
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card)
        return res.status(404).send({ message: "Cartão não encontrado" });
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError")
        return res.status(400).send({ message: "ID inválido" });
      return res.status(500).send({ message: "Erro no servidor" });
    });
};

// DELETE /cards/:cardId/likes
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card)
        return res.status(404).send({ message: "Cartão não encontrado" });
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError")
        return res.status(400).send({ message: "ID inválido" });
      return res.status(500).send({ message: "Erro no servidor" });
    });
};
