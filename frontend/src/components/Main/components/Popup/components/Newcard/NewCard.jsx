import { useState } from "react";

export default function NewCard({ onAddPlaceSubmit }) {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddPlaceSubmit({ name, link });
    setName("");
    setLink("");
  };

  return (
    <form className="add-popup__form" onSubmit={handleSubmit} noValidate>
      <fieldset className="popup__form-fieldset">
        <div className="popup__input-group">
          <input
            type="text"
            className="popup__input"
            id="name-title"
            name="name-title"
            placeholder="Título"
            minLength={2}
            maxLength={30}
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <span className="popup__input-error" id="name-title-error"></span>
        </div>
        <div className="popup__input-group">
          <input
            type="url"
            className="popup__input"
            id="link"
            name="link"
            placeholder="URL"
            required
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <span className="popup__input-error" id="link-error"></span>
        </div>
      </fieldset>
      <button id="create" type="submit" className="popup__create-button">
        Criar
      </button>
    </form>
  );
}
