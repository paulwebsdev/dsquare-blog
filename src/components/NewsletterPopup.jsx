import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function openPopup() {
      setIsOpen(true);
      setMessage("");
    }

    window.addEventListener(
      "open-newsletter-popup",
      openPopup
    );

    const subscribed = localStorage.getItem(
      "newsletter_subscribed"
    );

    const dismissedUntil = localStorage.getItem(
      "newsletter_popup_dismissed_until"
    );

    if (subscribed === "true") {
      return () => {
        window.removeEventListener(
          "open-newsletter-popup",
          openPopup
        );
      };
    }

    if (
      dismissedUntil &&
      Date.now() < Number(dismissedUntil)
    ) {
      return () => {
        window.removeEventListener(
          "open-newsletter-popup",
          openPopup
        );
      };
    }

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 10000);

    return () => {
      clearTimeout(timer);

      window.removeEventListener(
        "open-newsletter-popup",
        openPopup
      );
    };
  }, []);

  function closePopup() {
    setIsOpen(false);

    const sevenDays =
      7 * 24 * 60 * 60 * 1000;

    localStorage.setItem(
      "newsletter_popup_dismissed_until",
      String(Date.now() + sevenDays)
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const trimmedEmail =
      email.trim().toLowerCase();

    if (!trimmedEmail) {
      setMessage(
        "Please enter your email address."
      );
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert([
        {
          email: trimmedEmail,
        },
      ]);

    setLoading(false);

    if (error) {
      if (error.code === "23505") {
        localStorage.setItem(
          "newsletter_subscribed",
          "true"
        );

        setMessage(
          "You're already subscribed. Thank you!"
        );
      } else {
        console.error(
          "Newsletter subscription error:",
          error
        );

        setMessage(
          "Something went wrong. Please try again."
        );
      }

      return;
    }

    localStorage.setItem(
      "newsletter_subscribed",
      "true"
    );

    localStorage.removeItem(
      "newsletter_popup_dismissed_until"
    );

    setMessage(
      "Thanks for subscribing! 🎉"
    );

    setEmail("");
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-5 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="newsletter-popup-title"
    >
      <div className="relative w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl sm:p-9">
        <button
          type="button"
          onClick={closePopup}
          aria-label="Close newsletter popup"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
        >
          ×
        </button>

        <div className="flex justify-center">
          <img
            src="/images/dsquare-web-logo.png"
            alt="Dsquare Web"
            className="h-14 w-14 rounded-2xl object-cover"
          />
        </div>

        <p className="mt-5 text-center text-sm font-semibold uppercase tracking-wider text-blue-600">
          Stay Updated
        </p>

        <h2
          id="newsletter-popup-title"
          className="mt-2 text-center text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl"
        >
          Get the latest from Dsquare Web
        </h2>

        <p className="mt-3 text-center leading-7 text-gray-600">
          Get useful articles, web tips, AI updates,
          business ideas, and interesting technology
          content delivered to your inbox.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-3"
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
            autoComplete="email"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Subscribing..."
              : "Subscribe"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-600">
            {message}
          </p>
        )}

        <p className="mt-5 text-center text-xs text-gray-400">
          No spam. Just useful content. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}

export default NewsletterPopup;