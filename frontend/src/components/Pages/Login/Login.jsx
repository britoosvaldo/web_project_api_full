import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // ✅ passe dois argumentos
      await onLogin(email, password);
    } catch (err) {
      console.error("Falha ao autenticar:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth">
      <div className="auth__container">
        <h1 className="auth__title">Entrar</h1>

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
              autoComplete="current-password"
              minLength={6}
            />
          </label>

          <button
            className="auth__button"
            type="submit"
            disabled={submitting || !email || !password}
          >
            {submitting ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="auth__hint">
          Ainda não é membro?{" "}
          <Link to="/signup" className="auth__link">
            Inscreva-se aqui!
          </Link>
        </p>
      </div>
    </main>
  );
}
