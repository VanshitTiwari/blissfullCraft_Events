import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, setToken } from "../api.js";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");

    try {
      const data = await api("/api/auth/login", {
        method: "POST",
        body: {
          email,
          password
        }
      });

      setToken(data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="admin-login">
      <form className="form compact" onSubmit={submit}>
        <p className="eyebrow">BlissCraft Events</p>

        <h1>Admin sign in</h1>

        <p className="muted">
          Sign in to manage events, enquiries, and other website content.
        </p>

        <label>
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Admin email"
            required
          />
        </label>

        <label>
          Password
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            required
          />
        </label>

        <button className="btn" type="submit">
          Sign in
        </button>

        {error && (
          <p className="note err">
            {error}
          </p>
        )}
      </form>
    </main>
  );
}