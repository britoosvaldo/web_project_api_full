import { useState } from "react";
import { Link } from "react-router-dom";

export default function Register({ onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // ✅ passe dois argumentos
      await onRegister(email, password);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth">
      <div className="auth__container">
        <h1 className="auth__title">Inscrever-se</h1>

        <form className="auth__form" onSubmit={handleSubmit} noValidate>
          <label className="auth__label">
            <input
              className="auth__input"
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </label>

          <label className="auth__label">
            <input
              className="auth__input"
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </label>

          <button
            className="auth__button"
            type="submit"
            disabled={submitting || !email || !password}
          >
            {submitting ? "Enviando..." : "Inscrever-se"}
          </button>
        </form>

        <p className="auth__hint">
          Já é um membro?{" "}
          <Link to="/signin" className="auth__link">
            Faça o login aqui!
          </Link>
        </p>
      </div>
    </main>
  );
}
