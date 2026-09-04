import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error);
      setError(error.message);
      setLoading(false);
      return;
    }

    navigate("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">

      <div className="w-full max-w-md">

        {/* LOGO */}
        <div className="mb-8 text-center">
          <Link to="/" className="text-3xl font-bold">
            Dsquare<span className="text-blue-600">Web</span>
          </Link>

          <p className="mt-2 text-gray-500">
            Blog Admin
          </p>
        </div>

        {/* LOGIN CARD */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">

          <h1 className="text-2xl font-bold">
            Admin Login
          </h1>

          <p className="mt-2 text-gray-500">
            Sign in to manage your blog.
          </p>

          {error && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-600">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-6 space-y-5">

            {/* EMAIL */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

          </form>

        </div>

        {/* BACK */}
        <div className="mt-6 text-center">
          <Link
            to="/blog"
            className="text-sm font-semibold text-blue-600 hover:underline"
          >
            ← Back to Blog
          </Link>
        </div>

      </div>

    </div>
  );
}

export default Login;

