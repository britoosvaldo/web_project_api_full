export default function Popup(props) {
  const { onClose, title, children } = props;
  return (
    <div className="popup popup_opened">
      <div
        className={`popup__container ${!title ? "image-popup__container" : ""}`}
      >
        <button
          type="button"
          className="add-popup__close-button"
          onClick={onClose}
        >
          <img
            src="images/close-icon.png"
            className="popup__close-icon"
            alt="Close button"
          />
        </button>
        {title && <h3 className="popup__container-title">{title}</h3>}
        {children}
      </div>
    </div>
  );
}
