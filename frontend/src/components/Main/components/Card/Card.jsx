const base = import.meta.env.BASE_URL;

export default function Card({ card, onImageClick, onCardLike, onCardDelete }) {
  const { name, link, isLiked, canDelete } = card;

  const cardLikeButtonClassName = `elements__like-button ${
    isLiked ? "elements__like-button_is-active" : ""
  }`;

  const handleLikeClick = () => onCardLike(card);
  const handleDeleteClick = () => onCardDelete(card);

  return (
    <li className="elements__card">
      {canDelete && (
        <img
          className="elements__delete-button"
          src={`${base}images/delete-button.png`}
          alt="Remover card"
          onClick={() => onCardDelete(card)}
          style={{ cursor: "pointer" }}
        />
      )}

      <img
        className="elements__image"
        src={link}
        alt={name}
        onClick={() => onImageClick(card)}
        style={{ cursor: "pointer" }}
        onError={(e) => {
          e.currentTarget.src = "https://picsum.photos/600/400";
        }}
      />

      <div className="elements__description">
        <h2 className="elements__text">{name}</h2>

        <img
          className="elements__like-button"
          src={`${base}images/${
            isLiked ? "liked-button.png" : "like-button.png"
          }`}
          alt={isLiked ? "Remover like" : "Dar like"}
          onClick={() => onCardLike(card)}
          style={{ cursor: "pointer" }}
        />
      </div>
    </li>
  );
}
