export default function ImagePopup(props) {
  const { card, onClose } = props;
  const { name, link } = card;
  return (
    <section className="image-popup">
      <div className="image-popup__container">
        <button
          type="button"
          className="image-popup__close-button"
          onClick={onClose}
        >
          <img
            src="images/close-icon.png"
            className="popup__close-icon"
            alt="Botão de fechar"
          />
        </button>
        <img src={link} alt={name} className="image-popup__image" />
        <p className="image-popup__place">{name}</p>
      </div>
    </section>
  );
}
