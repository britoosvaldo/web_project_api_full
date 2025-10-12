import { useState, useContext, useEffect } from "react";
import CurrentUserContext from "../../../../../../contexts/CurrentUserContext";

export default function EditProfile() {
  const { currentUser, handleUpdateUser } = useContext(CurrentUserContext);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    setName(currentUser.name || "");
    setDescription(currentUser.about || "");
  }, [currentUser]);

  const handleNameChange = (e) => setName(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdateUser({ name, about: description });
  };

  return (
    <form className="popup__form" noValidate onSubmit={handleSubmit}>
      <fieldset className="popup__form-fieldset">
        <div className="popup__input-group">
          <input
            type="text"
            className="popup__input"
            id="name"
            name="name"
            placeholder="Jacques Cousteau"
            minLength={2}
            maxLength={40}
            required
            value={name}
            onChange={handleNameChange}
          />
          <span className="popup__input-error" id="name-error"></span>
        </div>

        <div className="popup__input-group">
          <input
            type="text"
            className="popup__input"
            id="about"
            name="about"
            placeholder="Explorador"
            minLength={2}
            maxLength={200}
            required
            value={description}
            onChange={handleDescriptionChange}
          />
          <span className="popup__input-error" id="about-error"></span>
        </div>
      </fieldset>

      <button type="submit" className="popup__save-button">
        Salvar
      </button>
    </form>
  );
}
