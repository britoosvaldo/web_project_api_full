import { useState, useContext, useEffect } from "react";
import CurrentUserContext from "../../../../../../contexts/CurrentUserContext";

export default function EditProfile() {
  const { currentUser, handleUpdateUser } = useContext(CurrentUserContext);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [nameError, setNameError] = useState("");
  const [aboutError, setAboutError] = useState("");

  function validateName(v) {
    const value = v.trim();
    if (value.length < 2 || value.length > 30) return "Conteúdo inválido";
    return "";
  }
  function validateAbout(v) {
    const value = v.trim();
    if (value.length < 2 || value.length > 30) return "Conteúdo inválido";
    return "";
  }

  useEffect(() => {
    setName(currentUser.name || "");
    setDescription(currentUser.about || "");
    setNameError("");
    setAboutError("");
  }, [currentUser]);

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);

    if (value.trim().length < 2 || value.trim().length > 30) {
      setNameError(true);
    } else {
      setNameError(false);
    }
  };

  const handleDescriptionChange = (e) => {
    const v = e.target.value;
    setDescription(v);
    setAboutError(validateAbout(v));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nErr = validateName(name);
    const aErr = validateAbout(description);
    setNameError(nErr);
    setAboutError(aErr);

    if (nErr || aErr) return;

    handleUpdateUser({ name: name.trim(), about: description.trim() });
  };

  const hasErrors =
    !!nameError || !!aboutError || !name.trim() || !description.trim();

  return (
    <form className="popup__form" noValidate onSubmit={handleSubmit}>
      <fieldset className="popup__form-fieldset">
        <div className="popup__input-group">
          <input
            type="text"
            className={`popup__input ${
              nameError ? "popup__input_invalid" : ""
            }`}
            id="name"
            name="name"
            placeholder="Jacques Cousteau"
            minLength={2}
            maxLength={40}
            required
            value={name}
            onChange={handleNameChange}
            aria-invalid={!!nameError}
            aria-describedby="name-error"
          />
          <span className="popup__input-error" id="name-error">
            {nameError}
          </span>
        </div>

        <div className="popup__input-group">
          <input
            type="text"
            className={`popup__input ${
              aboutError ? "popup__input_invalid" : ""
            }`}
            id="about"
            name="about"
            placeholder="Explorador"
            minLength={2}
            maxLength={40}
            required
            value={description}
            onChange={handleDescriptionChange}
            aria-invalid={!!aboutError}
            aria-describedby="about-error"
          />
          <span className="popup__input-error" id="about-error">
            {aboutError}
          </span>
        </div>
      </fieldset>

      <button
        type="submit"
        className="popup__save-button"
        disabled={hasErrors}
        aria-disabled={hasErrors}
      >
        Salvar
      </button>
    </form>
  );
}
