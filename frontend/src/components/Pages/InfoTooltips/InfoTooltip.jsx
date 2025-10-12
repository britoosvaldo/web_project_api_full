export default function InfoTooltip({
  isOpen,
  type = "success",
  message = "",
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <div className="itp" onMouseDown={onClose}>
      <div className="itp__box" onMouseDown={(e) => e.stopPropagation()}>
        <button
          className="itp__close"
          type="button"
          onClick={onClose}
          aria-label="Fechar"
        >
          <img
            src="images/close-icon.png"
            className="popup__close-icon"
            alt="Close button"
          />
        </button>

        {type === "success" ? (
          <div className="itp__icon itp__icon--success" aria-hidden>
            <svg viewBox="0 0 72 72">
              <circle cx="36" cy="36" r="32" fill="none" />
              <path d="M22 37 l10 10 l18 -18" fill="none" />
            </svg>
          </div>
        ) : (
          <div className="itp__icon itp__icon--error" aria-hidden>
            <svg viewBox="0 0 72 72">
              <circle cx="36" cy="36" r="32" fill="none" />
              <path d="M25 25 L47 47 M47 25 L25 47" fill="none" />
            </svg>
          </div>
        )}

        <p className="itp__msg">{message}</p>
      </div>
    </div>
  );
}
