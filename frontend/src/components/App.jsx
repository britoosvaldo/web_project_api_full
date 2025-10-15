import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import Main from "./Main/Main";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";

import CurrentUserContext from "../contexts/CurrentUserContext";
import * as api from "../utils/api";
import * as auth from "../utils/auth";
import { getToken, setToken, removeToken } from "../utils/tokens";

import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import InfoTooltip from "./Pages/InfoTooltips/InfoTooltip";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";

export default function App() {
  const [popup, setPopup] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [booting, setBooting] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const [tooltip, setTooltip] = useState({
    open: false,
    type: "success",
    message: "",
    afterClose: null,
  });

  const openSuccess = (message, afterClose) =>
    setTooltip({
      open: true,
      type: "success",
      message,
      afterClose: afterClose || null,
    });

  const openError = (message, afterClose) =>
    setTooltip({
      open: true,
      type: "error",
      message,
      afterClose: afterClose || null,
    });

  const closeTooltip = () => {
    setTooltip((t) => {
      if (typeof t.afterClose === "function") t.afterClose();
      return { ...t, open: false, afterClose: null };
    });
  };

  function handleOpenPopup(popupContent) {
    setPopup(popupContent);
  }
  function handleClosePopup() {
    setPopup(null);
  }

  function handleUpdateUser({ name, about }) {
    api
      .editUserInfo(name, about)
      .then((updatedUser) => {
        setCurrentUser(updatedUser);
        setPopup(null);
      })
      .catch((err) => console.error("Erro ao atualizar perfil:", err));
  }

  function handleUpdateAvatar({ avatar }) {
    api
      .profilePhotoUpdate(avatar)
      .then((updatedUser) => {
        setCurrentUser(updatedUser);
        setPopup(null);
      })
      .catch((err) => console.error("Erro ao atualizar avatar:", err));
  }

  const enrichCard = (card, userId) => {
    const ownerId =
      typeof card.owner === "object" && card.owner
        ? card.owner._id
        : card.owner;

    return {
      ...card,
      isLiked:
        Array.isArray(card.likes) &&
        card.likes.some((like) => (like._id || like) === userId),
      canDelete: String(ownerId) === String(userId),
    };
  };

  function handleCardLike(card) {
    const isLiked = card.isLiked;
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((updated) => {
        const enriched = enrichCard(updated, currentUser._id);
        setCards((state) =>
          state.map((c) => (c._id === card._id ? enriched : c))
        );
      })
      .catch((error) => console.error("Erro ao curtir/descurtir:", error));
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
      })
      .catch((error) => console.error("Erro ao deletar o card:", error));
  }

  function handleAddPlaceSubmit({ name, link }) {
    api
      .addNewCard(name, link)
      .then((created) => {
        const enriched = enrichCard(created, currentUser._id);
        setCards((prevCards) => [enriched, ...prevCards]);
        setPopup(null);
      })
      .catch((err) => console.error("Erro ao adicionar card:", err));
  }

  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) setUserEmail(savedEmail);

    const t = getToken();
    if (!t) {
      setBooting(false);
      return;
    }

    Promise.all([api.getUserInfo(), api.getInitialCards()])
      .then(([userData, cardsData]) => {
        setCurrentUser(userData);
        const enriched = Array.isArray(cardsData)
          ? cardsData.map((c) => enrichCard(c, userData._id))
          : [];
        setCards(enriched);
        setIsLoggedIn(true);
      })
      .catch((err) => {
        console.error("Falha ao carregar dados:", err);
        removeToken();
        setIsLoggedIn(false);
        setUserEmail("");
        localStorage.removeItem("userEmail");
      })
      .finally(() => setBooting(false));
  }, []);

  // Login
  async function handleLogin(email, password) {
    try {
      const { token } = await auth.signin(email, password);
      setToken(token);

      const [user, initCards] = await Promise.all([
        api.getUserInfo(),
        api.getInitialCards(),
      ]);

      setCurrentUser(user);
      setCards(initCards.map((c) => enrichCard(c, user._id)));
      setIsLoggedIn(true);

      setUserEmail(email);
      localStorage.setItem("userEmail", email);

      navigate("/", { replace: true });
    } catch (err) {
      console.error("Erro no login:", err);
      openError("Ops, algo deu errado!\nPor favor, tente novamente.");
    }
  }

  // Registro
  async function handleRegister(email, password) {
    try {
      const res = await auth.signup(email, password);

      if (res?.token) {
        setToken(res.token);

        const [user, initCards] = await Promise.all([
          api.getUserInfo(),
          api.getInitialCards(),
        ]);

        setCurrentUser(user);
        setCards(initCards.map((c) => enrichCard(c, user._id)));
        setIsLoggedIn(true);

        setUserEmail(email);
        localStorage.setItem("userEmail", email);

        openSuccess("Conta criada com sucesso!");
        navigate("/", { replace: true });
      } else {
        openSuccess("Vitória! Você se registrou com sucesso.", () => {
          navigate("/signin", { replace: true });
        });
      }
    } catch (err) {
      console.error("Erro no registro:", err);
      openError("Ops, algo deu errado!\nPor favor, tente novamente.");
    }
  }

  function handleLogout() {
    removeToken();
    setIsLoggedIn(false);
    setCurrentUser({});
    setCards([]);
    setUserEmail("");
    localStorage.removeItem("userEmail");
    navigate("/signin", { replace: true });
  }

  if (booting) return null;

  return (
    <CurrentUserContext.Provider
      value={{ currentUser, handleUpdateUser, handleUpdateAvatar }}
    >
      <div className="page">
        <Header userEmail={userEmail} onLogout={handleLogout} />

        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Main
                  cards={cards}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                  onAddPlaceSubmit={handleAddPlaceSubmit}
                  onOpenPopup={handleOpenPopup}
                  onClosePopup={handleClosePopup}
                  popup={popup}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signup"
            element={<Register onRegister={handleRegister} />}
          />
          <Route path="/signin" element={<Login onLogin={handleLogin} />} />
          <Route
            path="*"
            element={<Navigate to={isLoggedIn ? "/" : "/signin"} replace />}
          />
        </Routes>

        {location.pathname !== "/signin" && location.pathname !== "/signup" && (
          <Footer />
        )}

        <InfoTooltip
          isOpen={tooltip.open}
          type={tooltip.type}
          message={tooltip.message}
          onClose={closeTooltip}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}
