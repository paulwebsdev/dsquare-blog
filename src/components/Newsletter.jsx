import { useState } from "react";
import { supabase } from "../services/supabase";

function Newsletter() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setMessage("Please enter your email address.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert([{ email: trimmedEmail }]);

    setLoading(false);

    if (error) {
      if (error.code === "23505") {
        setMessage("You're already subscribed. Thank you!");
      } else {
        console.error("Newsletter subscription error:", error);
        setMessage("Something went wrong. Please try again.");
      }

      return;
    }

    setMessage("Thanks for subscribing! 🎉");
    setEmail("");
  }

  return (
    <section className="rounded-3xl bg-gray-950 px-6 py-12 text-white md:px-10">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
          Stay Updated
        </p>

        <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
          Get useful insights delivered to your inbox.
        </h2>

        <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-400">
          Subscribe to Dsquare Web Blog for practical articles about
          web development, online business, AI, technology, and
          making money online.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-7 flex max-w-xl flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setMessage("");
            }}
            placeholder="Enter your email address"
            aria-label="Email address"
            disabled={loading}
            className="min-w-0 flex-1 rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-900 disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Subscribing..." : "Subscribe"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-gray-400">
            {message}
          </p>
        )}

        <p className="mt-4 text-xs text-gray-500">
          No spam. Just useful content.
        </p>
      </div>
    </section>
  );
}

export default Newsletter;
