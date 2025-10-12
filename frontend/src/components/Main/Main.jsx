import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import avatarDefault from "../../images/profile-photo.png";
import NewCard from "./components/Popup/components/Newcard/NewCard";
import EditProfile from "./components/Popup/components/EditProfile/EditProfile";
import EditAvatar from "./components/Popup/components/EditAvatar/EditAvatar";
import Card from "./components/Card/Card";
import Popup from "../../components/Main/components/Popup/Popup";
import ImagePopup from "./components/ImagePopup/ImagePopup";

export default function Main({
  cards,
  onCardLike,
  onCardDelete,
  onAddPlaceSubmit,
  onOpenPopup,
  onClosePopup,
  popup,
}) {
  const { currentUser } = useContext(CurrentUserContext);

  const newCardPopup = {
    title: "New Card",
    children: <NewCard onAddPlaceSubmit={onAddPlaceSubmit} />,
  };
  const editProfilePopup = { title: "Edit Profile", children: <EditProfile /> };
  const editAvatarPopup = { title: "Edit Avatar", children: <EditAvatar /> };

  function handleCardImageClick(card) {
    onOpenPopup({ type: "image", card });
  }

  return (
    <main className="content">
      <section className="profile">
        <div className="profile__photo-container">
          <img
            src={currentUser.avatar || avatarDefault}
            alt="Foto de perfil"
            className="profile__photo"
          />
          <button
            className="profile__photo-edit-btn"
            type="button"
            onClick={() => onOpenPopup(editAvatarPopup)}
          >
            <img
              src="images/editPhoto-button.png"
              alt="Editar foto"
              className="profile__photo-edit-icon"
            />
          </button>
        </div>

        <div className="profile__info">
          <h2 className="profile__name">{currentUser.name || "..."}</h2>
          <button
            className="profile__edit-button"
            onClick={() => onOpenPopup(editProfilePopup)}
          >
            <img
              src="images/edit-button.png"
              className="profile__edit-button-image"
              alt="Editar perfil"
            />
          </button>
          <h3 className="profile__about">{currentUser.about || "..."}</h3>
        </div>

        <button
          className="profile__add-button"
          onClick={() => onOpenPopup(newCardPopup)}
        >
          <img
            src="images/add-button.png"
            className="profile__add-button-image"
            alt="Adicionar"
          />
        </button>
      </section>

      <ul className="elements">
        {cards.map((card) => (
          <Card
            key={card._id}
            card={card}
            onImageClick={handleCardImageClick}
            onCardLike={onCardLike}
            onCardDelete={onCardDelete}
          />
        ))}
      </ul>

      {popup?.type === "image" && (
        <ImagePopup card={popup.card} onClose={onClosePopup} />
      )}

      {popup && popup.type !== "image" && (
        <Popup onClose={onClosePopup} title={popup.title}>
          {popup.children}
        </Popup>
      )}
    </main>
  );
}
