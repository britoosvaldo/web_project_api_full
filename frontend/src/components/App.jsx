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

  function handleCardLike(card) {
    const isLiked = card.isLiked;
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        const updatedCard = {
          ...newCard,
          isLiked:
            typeof newCard.isLiked === "boolean"
              ? newCard.isLiked
              : Array.isArray(newCard.likes) &&
                newCard.likes.some((like) => like._id === currentUser._id),
        };
        setCards((state) =>
          state.map((c) => (c._id === card._id ? updatedCard : c))
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
      .then((newCard) => {
        const enrichedCard = {
          ...newCard,
          isLiked:
            Array.isArray(newCard.likes) &&
            newCard.likes.some((like) => like._id === currentUser._id),
        };
        setCards((prevCards) => [enrichedCard, ...prevCards]);
        setPopup(null);
      })
      .catch((err) => console.error("Erro ao adicionar card:", err));
  }

  // Boot: tenta iniciar sessão com token salvo
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
        setCards(cardsData);
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
  async function handleLogin({ email, password }) {
    try {
      // se seu auth.signin recebe (email, password), mantenha assim;
      // se recebe objeto, troque para: auth.signin({ email, password })
      const { token } = await auth.signin(email, password);
      setToken(token);

      const [user, initCards] = await Promise.all([
        api.getUserInfo(),
        api.getInitialCards(),
      ]);

      setCurrentUser(user);
      setCards(initCards);
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
  async function handleRegister({ email, password, name, about, avatar }) {
    try {
      // compatível com backend que retorna { data } OU { data, token }
      const res = await auth.signup({ email, password, name, about, avatar });

      if (res?.token) {
        // auto-login se o backend devolveu token no signup
        setToken(res.token);

        const [user, initCards] = await Promise.all([
          api.getUserInfo(),
          api.getInitialCards(),
        ]);

        setCurrentUser(user);
        setCards(initCards);
        setIsLoggedIn(true);

        setUserEmail(email);
        localStorage.setItem("userEmail", email);

        openSuccess("Conta criada com sucesso!");
        navigate("/", { replace: true });
      } else {
        // caso não venha token, manda para login (com mensagem)
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
