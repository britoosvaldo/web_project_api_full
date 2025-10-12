export default function Card({ card, onImageClick, onCardLike, onCardDelete }) {
  const { name, link, isLiked } = card;

  const cardLikeButtonClassName = `elements__like-button ${
    isLiked ? "elements__like-button_is-active" : ""
  }`;

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleDeleteClick() {
    onCardDelete(card);
  }

  return (
    <li className="elements__card">
      <img
        className="elements__delete-button"
        src="/web_project_around_auth/images/delete-button.png"
        alt="Delete Button"
        onClick={handleDeleteClick}
        style={{ cursor: "pointer" }}
      />

      <img
        className="elements__image"
        src={link}
        alt={name}
        onClick={() => onImageClick(card)}
        style={{ cursor: "pointer" }}
      />

      <div className="elements__description">
        <h2 className="elements__text">{name}</h2>

        <img
          className={cardLikeButtonClassName}
          src={
            isLiked
              ? "/web_project_around_auth/images/like-button.png"
              : "/web_project_around_auth/images/liked-button.png"
          }
          alt="Like Button"
          onClick={handleLikeClick}
          style={{ cursor: "pointer" }}
        />
      </div>
    </li>
  );
}
