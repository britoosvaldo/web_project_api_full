import { useRef, useContext } from "react";
import CurrentUserContext from "../../../../../../contexts/CurrentUserContext";

export default function EditAvatar() {
  const { handleUpdateAvatar } = useContext(CurrentUserContext);
  const inputRef = useRef();

  function handleSubmit(e) {
    e.preventDefault();

    handleUpdateAvatar({
      avatar: inputRef.current.value,
    });

    e.target.reset();
  }

  return (
    <form className="avatar-popup__form" onSubmit={handleSubmit} noValidate>
      <fieldset className="popup__form-fieldset">
        <div className="popup__input-group">
          <input
            type="url"
            className="popup__input"
            id="avatar-link"
            name="avatar-link"
            placeholder="URL da nova foto"
            required
            ref={inputRef}
          />
          <span className="popup__input-error" id="avatar-link-error"></span>
        </div>
      </fieldset>
      <button type="submit" className="popup__save-button">
        Salvar
      </button>
    </form>
  );
}
