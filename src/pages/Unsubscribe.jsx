import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../services/supabase";

function Unsubscribe() {
  const { token } = useParams();

  const [checking, setChecking] = useState(true);
  const [unsubscribing, setUnsubscribing] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function checkToken() {
      if (!token) {
        setMessage("Invalid unsubscribe link.");
        setChecking(false);
        return;
      }

      const { data, error } = await supabase.rpc(
        "get_newsletter_subscription",
        {
          token,
        }
      );

      if (error || !data) {
        console.error("Token check error:", error);

        setMessage(
          "This unsubscribe link is invalid or has already been used."
        );
      } else {
        setEmail(data);
      }

      setChecking(false);
    }

    checkToken();
  }, [token]);

  async function handleUnsubscribe() {
    if (!token) return;

    setUnsubscribing(true);
    setMessage("");

    const { data, error } = await supabase.rpc(
      "unsubscribe_from_newsletter",
      {
        token,
      }
    );

    setUnsubscribing(false);

    if (error) {
      console.error("Unsubscribe error:", error);

      setMessage(
        "Something went wrong. Please try again."
      );
      return;
    }

    if (!data) {
      setEmail("");
      setMessage(
        "This unsubscribe link is invalid or has already been used."
      );
      return;
    }

    setEmail("");
    setMessage(
      "You have been successfully unsubscribed from the Dsquare Web Blog newsletter."
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-20">
      <div className="mx-auto max-w-lg rounded-3xl bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-2xl">
          📩
        </div>

        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Newsletter Subscription
        </h1>

        {checking ? (
          <p className="mt-4 text-gray-600">
            Checking your subscription...
          </p>
        ) : email ? (
          <>
            <p className="mt-4 text-gray-600">
              You're currently subscribed with:
            </p>

            <p className="mt-2 break-all font-semibold text-gray-900">
              {email}
            </p>

            <button
              onClick={handleUnsubscribe}
              disabled={unsubscribing}
              className="mt-7 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {unsubscribing
                ? "Unsubscribing..."
                : "Unsubscribe"}
            </button>
          </>
        ) : (
          <>
            <p className="mt-4 text-gray-600">
              {message}
            </p>

            <p className="mt-4 text-sm text-gray-500">
              You can close this page.
            </p>
          </>
        )}

        {!checking && !email && message && message.includes("successfully") && (
          <p className="mt-4 text-sm text-gray-500">
            You can close this page.
          </p>
        )}
      </div>
    </main>
  );
}

export default Unsubscribe;
