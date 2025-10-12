import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../images/logo.png";

export default function Header({ userEmail, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoutClick = () => {
    onLogout();
    navigate("/signin");
  };

  const hideRight =
    location.pathname === "/signin" || location.pathname === "/signup";

  return (
    <header className="header" id="header">
      <nav className="nav">
        <img src={logo} alt="logotipo" className="nav__logo" />
        {!hideRight && (
          <div className="nav__right">
            <span className="nav__email">{userEmail || ""}</span>
            <button className="nav__logout" onClick={handleLogoutClick}>
              Sair
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
