import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../services/supabase";

const BLOG_URL = "https://blog.dsquareweb.name.ng";

function Newsletter() {
  const [subscribers, setSubscribers] = useState([]);
  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);

  const [message, setMessage] = useState("");

  const [selectedIds, setSelectedIds] = useState([]);

  const [selectedPostId, setSelectedPostId] = useState("");
  const [intro, setIntro] = useState("");

  const [sendingNewsletter, setSendingNewsletter] = useState(false);

  const [testEmail, setTestEmail] = useState("");
  const [sendingTest, setSendingTest] = useState(false);

  // --------------------------------------------------
  // LOAD SUBSCRIBERS
  // --------------------------------------------------

  async function fetchSubscribers() {
    setLoading(true);

    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .select("id, email, subscribed_at, unsubscribe_token")
      .order("subscribed_at", { ascending: false });

    if (error) {
      console.error("Subscribers error:", error);
      setMessage("Unable to load subscribers.");
      setSubscribers([]);
    } else {
      setSubscribers(data || []);
    }

    setLoading(false);
  }

  // --------------------------------------------------
  // LOAD PUBLISHED POSTS
  // --------------------------------------------------

  async function fetchPosts() {
    setPostsLoading(true);

    const { data, error } = await supabase
      .from("posts")
      .select(
        "id, title, slug, excerpt, featured_image, published_at"
      )
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Posts error:", error);
      setMessage("Unable to load published articles.");
      setPosts([]);
    } else {
      setPosts(data || []);
    }

    setPostsLoading(false);
  }

  useEffect(() => {
    fetchSubscribers();
    fetchPosts();
  }, []);

  // --------------------------------------------------
  // SELECT SUBSCRIBERS
  // --------------------------------------------------

  function toggleSubscriber(id) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id]
    );

    setMessage("");
  }

  function selectAll() {
    setSelectedIds(
      subscribers.map((subscriber) => subscriber.id)
    );

    setMessage("");
  }

  function clearSelection() {
    setSelectedIds([]);
    setMessage("");
  }

  // --------------------------------------------------
  // DELETE SUBSCRIBER
  // --------------------------------------------------

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this subscriber?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("newsletter_subscribers")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete subscriber error:", error);
      setMessage("Unable to delete subscriber.");
      return;
    }

    setSubscribers((current) =>
      current.filter((subscriber) => subscriber.id !== id)
    );

    setSelectedIds((current) =>
      current.filter((selectedId) => selectedId !== id)
    );

    setMessage("Subscriber deleted.");
  }

  // --------------------------------------------------
  // SELECTED ARTICLE
  // --------------------------------------------------

  const selectedPost = posts.find(
    (post) => String(post.id) === String(selectedPostId)
  );

  // --------------------------------------------------
  // CREATE NEWSLETTER HTML
  // --------------------------------------------------

  function createNewsletterHtml(
    post,
    newsletterIntro,
    unsubscribeToken = ""
  ) {
    const articleUrl = `${BLOG_URL}/blog/${post.slug}`;

    const unsubscribeUrl = unsubscribeToken
      ? `${BLOG_URL}/unsubscribe/${unsubscribeToken}`
      : "";

    const safeIntro = newsletterIntro
      ? newsletterIntro
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/\n/g, "<br />")
      : "";

    const safeTitle = (post.title || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    const safeExcerpt = (post.excerpt || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    const imageHtml = post.featured_image
      ? `
        <img
          src="${post.featured_image}"
          alt="${safeTitle}"
          style="
            width: 100%;
            max-width: 650px;
            height: auto;
            display: block;
            border-radius: 14px;
            margin: 0 auto 25px;
          "
        />
      `
      : "";

    return `
      <div
        style="
          margin: 0;
          padding: 30px 15px;
          background: #f3f4f6;
          font-family: Arial, Helvetica, sans-serif;
          color: #111827;
        "
      >

        <div
          style="
            max-width: 650px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 18px;
            overflow: hidden;
          "
        >

          <div
            style="
              padding: 25px 30px;
              border-bottom: 1px solid #e5e7eb;
            "
          >
            <a
              href="${BLOG_URL}"
              style="
                color: #2563eb;
                font-size: 22px;
                font-weight: bold;
                text-decoration: none;
              "
            >
              Dsquare Web Blog
            </a>
          </div>

          <div style="padding: 30px;">

            ${
              safeIntro
                ? `
                  <p
                    style="
                      font-size: 16px;
                      line-height: 1.7;
                      margin: 0 0 25px;
                      color: #374151;
                    "
                  >
                    ${safeIntro}
                  </p>
                `
                : ""
            }

            ${imageHtml}

            <h1
              style="
                font-size: 30px;
                line-height: 1.25;
                margin: 0 0 15px;
                color: #111827;
              "
            >
              ${safeTitle}
            </h1>

            ${
              safeExcerpt
                ? `
                  <p
                    style="
                      font-size: 16px;
                      line-height: 1.7;
                      color: #6b7280;
                      margin: 0 0 25px;
                    "
                  >
                    ${safeExcerpt}
                  </p>
                `
                : ""
            }

            <div style="text-align: center; margin: 30px 0;">
              <a
                href="${articleUrl}"
                style="
                  display: inline-block;
                  background: #2563eb;
                  color: #ffffff;
                  padding: 14px 25px;
                  border-radius: 10px;
                  font-size: 16px;
                  font-weight: bold;
                  text-decoration: none;
                "
              >
                Read the Full Article →
              </a>
            </div>

            <p
              style="
                text-align: center;
                font-size: 14px;
                color: #9ca3af;
                margin-top: 30px;
              "
            >
              Or copy this link into your browser:
            </p>

            <p
              style="
                text-align: center;
                font-size: 13px;
                word-break: break-all;
              "
            >
              <a
                href="${articleUrl}"
                style="color: #2563eb;"
              >
                ${articleUrl}
              </a>
            </p>

          </div>

          <div
            style="
              padding: 25px 30px;
              background: #f9fafb;
              border-top: 1px solid #e5e7eb;
              text-align: center;
            "
          >

            <p
              style="
                margin: 0 0 10px;
                font-size: 13px;
                color: #6b7280;
              "
            >
              You're receiving this email because you subscribed
              to the Dsquare Web Blog newsletter.
            </p>

            <p
              style="
                margin: 0;
                font-size: 13px;
                color: #6b7280;
              "
            >
              Dsquare Web
            </p>

            <p
              style="
                margin: 12px 0 0;
                font-size: 12px;
              "
            >
              <a
                href="${BLOG_URL}/contact"
                style="
                  color: #6b7280;
                  margin-right: 12px;
                "
              >
                Contact Us
              </a>

              ${
                unsubscribeUrl
                  ? `
                    <a
                      href="${unsubscribeUrl}"
                      style="color: #6b7280;"
                    >
                      Unsubscribe
                    </a>
                  `
                  : ""
              }
            </p>

          </div>

        </div>

      </div>
    `;
  }

  // --------------------------------------------------
  // SEND NEWSLETTER
  // --------------------------------------------------

  async function handleSendNewsletter() {
    if (!selectedPost) {
      setMessage("Please select an article.");
      return;
    }

    if (selectedIds.length === 0) {
      setMessage("Please select at least one subscriber.");
      return;
    }

    const selectedSubscribers = subscribers.filter((subscriber) =>
      selectedIds.includes(subscriber.id)
    );

    const articleTitle = selectedPost.title;

    const confirmed = window.confirm(
      `Send "${articleTitle}" to ${selectedSubscribers.length} selected subscriber${
        selectedSubscribers.length === 1 ? "" : "s"
      }?`
    );

    if (!confirmed) return;

    setSendingNewsletter(true);
    setMessage("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setMessage(
          "Your admin session has expired. Please log in again."
        );
        return;
      }

      const subject = `New on Dsquare Web Blog: ${selectedPost.title}`;

      const results = [];

      for (const subscriber of selectedSubscribers) {
        if (!subscriber.unsubscribe_token) {
          results.push({
            email: subscriber.email,
            success: false,
            error: "Missing unsubscribe token",
          });

          continue;
        }

        const html = createNewsletterHtml(
          selectedPost,
          intro.trim(),
          subscriber.unsubscribe_token
        );

        const { data, error } =
          await supabase.functions.invoke("resend-email", {
            body: {
              to: subscriber.email,
              subject,
              html,
            },
          });

        results.push({
          email: subscriber.email,
          success: !error && data?.sent > 0,
          error,
        });
      }

      const sent = results.filter(
        (result) => result.success
      ).length;

      const failed = results.length - sent;

      console.log("Newsletter results:", results);

      if (failed === 0) {
        setMessage(
          `Newsletter sent successfully to ${sent} subscriber${
            sent === 1 ? "" : "s"
          }. 🎉`
        );

        setSelectedIds([]);
        setIntro("");
      } else {
        setMessage(
          `Newsletter finished: ${sent} sent successfully, ${failed} failed.`
        );
      }
    } catch (error) {
      console.error("Unexpected newsletter error:", error);
      setMessage(
        "Something went wrong while sending the newsletter."
      );
    } finally {
      setSendingNewsletter(false);
    }
  }

  // --------------------------------------------------
  // TEST EMAIL
  // --------------------------------------------------

  async function handleSendTest() {
    const email = testEmail.trim().toLowerCase();

    if (!email) {
      setMessage(
        "Please enter an email address for the test."
      );
      return;
    }

    if (!selectedPost) {
      setMessage(
        "Please select an article before sending a test."
      );
      return;
    }

    setSendingTest(true);
    setMessage("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setMessage(
          "Your admin session has expired. Please log in again."
        );
        return;
      }

      const subject = `New on Dsquare Web Blog: ${selectedPost.title}`;

      const html = createNewsletterHtml(
        selectedPost,
        intro.trim()
      );

      const { data, error } =
        await supabase.functions.invoke("resend-email", {
          body: {
            to: email,
            subject,
            html,
          },
        });

      if (error) {
        console.error("Test email error:", error);
        setMessage(
          error.message || "Unable to send test email."
        );
        return;
      }

      console.log("Test email response:", data);

      setMessage(
        `Test newsletter sent successfully to ${email}. Check the inbox.`
      );

      setTestEmail("");
    } catch (error) {
      console.error("Unexpected test email error:", error);
      setMessage(
        "Something went wrong while sending the test email."
      );
    } finally {
      setSendingTest(false);
    }
  }

  const allSelected =
    subscribers.length > 0 &&
    selectedIds.length === subscribers.length;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">

      {/* NAVBAR */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <Link to="/" className="text-2xl font-bold">
            Dsquare<span className="text-blue-600">Web</span>
          </Link>

          <Link
            to="/admin"
            className="text-sm font-medium text-gray-600 hover:text-blue-600"
          >
            ← Dashboard
          </Link>

        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* HEADER */}
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

          <div>
            <p className="font-semibold text-blue-600">
              NEWSLETTER
            </p>

            <h1 className="mt-1 text-3xl font-bold md:text-4xl">
              Newsletter Manager
            </h1>

            <p className="mt-2 text-gray-600">
              Choose an article and send it to selected subscribers.
            </p>
          </div>

          <button
            onClick={() => {
              fetchSubscribers();
              fetchPosts();
            }}
            disabled={loading || postsLoading || sendingNewsletter}
            className="rounded-lg border border-gray-300 bg-white px-5 py-3 font-semibold hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Refresh
          </button>

        </div>

        {/* ARTICLE NEWSLETTER */}
        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Create Newsletter
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            Share an article
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Select an article, add a short introduction, then choose who should receive it.
          </p>

          {/* ARTICLE SELECT */}
          <div className="mt-6">

            <label className="mb-2 block text-sm font-semibold">
              Choose Article
            </label>

            <select
              value={selectedPostId}
              onChange={(e) => {
                setSelectedPostId(e.target.value);
                setMessage("");
              }}
              disabled={postsLoading || sendingNewsletter}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
            >

              <option value="">
                {postsLoading
                  ? "Loading articles..."
                  : "Select a published article"}
              </option>

              {posts.map((post) => (
                <option key={post.id} value={post.id}>
                  {post.title}
                </option>
              ))}

            </select>

          </div>

          {/* ARTICLE PREVIEW */}
          {selectedPost && (
            <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">

              {selectedPost.featured_image && (
                <img
                  src={selectedPost.featured_image}
                  alt={selectedPost.title}
                  className="h-56 w-full object-cover"
                />
              )}

              <div className="p-5">

                <p className="text-sm font-semibold text-blue-600">
                  ARTICLE PREVIEW
                </p>

                <h3 className="mt-2 text-xl font-bold">
                  {selectedPost.title}
                </h3>

                {selectedPost.excerpt && (
                  <p className="mt-3 leading-7 text-gray-600">
                    {selectedPost.excerpt}
                  </p>
                )}

              </div>

            </div>
          )}

          {/* INTRO */}
          <div className="mt-6">

            <label className="mb-2 block text-sm font-semibold">
              Short Introduction
              <span className="ml-2 font-normal text-gray-400">
                (optional)
              </span>
            </label>

            <textarea
              value={intro}
              onChange={(e) => {
                setIntro(e.target.value);
                setMessage("");
              }}
              placeholder="Example: We just published a new article that every business owner should read..."
              rows={5}
              disabled={sendingNewsletter}
              className="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 leading-7 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
            />

          </div>

          {/* SEND */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-sm text-gray-500">
              {selectedIds.length} subscriber
              {selectedIds.length === 1 ? "" : "s"} selected
            </p>

            <button
              onClick={handleSendNewsletter}
              disabled={
                sendingNewsletter ||
                loading ||
                postsLoading ||
                !selectedPost ||
                selectedIds.length === 0
              }
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sendingNewsletter
                ? "Sending Newsletter..."
                : "Send Newsletter"}
            </button>

          </div>

        </section>

        {/* TEST EMAIL */}
        <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6">

          <h2 className="text-xl font-bold">
            Test Newsletter
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Select an article above, then send a preview to your own email before sending it to subscribers.
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">

            <input
              type="email"
              value={testEmail}
              onChange={(e) => {
                setTestEmail(e.target.value);
                setMessage("");
              }}
              placeholder="Enter your email address"
              disabled={sendingTest || sendingNewsletter}
              className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
            />

            <button
              onClick={handleSendTest}
              disabled={sendingTest || sendingNewsletter || !selectedPost}
              className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sendingTest ? "Sending..." : "Send Test Newsletter"}
            </button>

          </div>

        </section>

        {/* STATS */}
        <div className="mt-8 grid gap-5 md:grid-cols-2">

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <p className="text-sm font-medium text-gray-500">
              Total Subscribers
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {loading ? "—" : subscribers.length}
            </p>

          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <p className="text-sm font-medium text-gray-500">
              Selected
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {selectedIds.length}
            </p>

          </div>

        </div>

        {/* MESSAGE */}
        {message && (
          <p className="mt-5 rounded-xl border border-gray-200 bg-white px-5 py-4 text-sm text-gray-600">
            {message}
          </p>
        )}

        {/* SUBSCRIBERS */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          {/* SELECT CONTROLS */}
          {!loading && subscribers.length > 0 && (
            <div className="flex flex-col gap-3 border-b border-gray-200 bg-gray-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

              <label className="flex cursor-pointer items-center gap-3 font-semibold">

                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={
                    allSelected
                      ? clearSelection
                      : selectAll
                  }
                  disabled={sendingNewsletter}
                  className="h-5 w-5"
                />

                Select All

              </label>

              <button
                onClick={clearSelection}
                disabled={
                  selectedIds.length === 0 ||
                  sendingNewsletter
                }
                className="text-left text-sm font-semibold text-gray-600 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50 sm:text-right"
              >
                Clear Selection
              </button>

            </div>
          )}

          {loading ? (
            <div className="p-10 text-center text-gray-500">
              Loading subscribers...
            </div>
          ) : subscribers.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-gray-500">
                No subscribers yet.
              </p>
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}
              <div className="hidden overflow-x-auto md:block">

                <table className="w-full text-left">

                  <thead className="border-b border-gray-200 bg-white">

                    <tr>

                      <th className="w-16 px-6 py-4">
                        <span className="sr-only">
                          Select
                        </span>
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold">
                        Email
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold">
                        Subscribed
                      </th>

                      <th className="px-6 py-4 text-right text-sm font-semibold">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-gray-200">

                    {subscribers.map((subscriber) => (
                      <tr
                        key={subscriber.id}
                        className={
                          selectedIds.includes(subscriber.id)
                            ? "bg-blue-50"
                            : ""
                        }
                      >

                        <td className="px-6 py-4">

                          <input
                            type="checkbox"
                            checked={selectedIds.includes(
                              subscriber.id
                            )}
                            onChange={() =>
                              toggleSubscriber(
                                subscriber.id
                              )
                            }
                            disabled={sendingNewsletter}
                            className="h-5 w-5"
                            aria-label={`Select ${subscriber.email}`}
                          />

                        </td>

                        <td className="px-6 py-4 font-medium">
                          {subscriber.email}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-500">
                          {subscriber.subscribed_at
                            ? new Date(
                                subscriber.subscribed_at
                              ).toLocaleDateString("en-NG", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : ""}
                        </td>

                        <td className="px-6 py-4 text-right">

                          <button
                            onClick={() =>
                              handleDelete(
                                subscriber.id
                              )
                            }
                            disabled={sendingNewsletter}
                            className="font-semibold text-red-600 hover:text-red-700 disabled:opacity-50"
                          >
                            Delete
                          </button>

                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>

              {/* MOBILE LIST */}
              <div className="divide-y divide-gray-200 md:hidden">

                {subscribers.map((subscriber) => (
                  <div
                    key={subscriber.id}
                    className={`p-5 ${
                      selectedIds.includes(subscriber.id)
                        ? "bg-blue-50"
                        : ""
                    }`}
                  >

                    <div className="flex items-start gap-3">

                      <input
                        type="checkbox"
                        checked={selectedIds.includes(
                          subscriber.id
                        )}
                        onChange={() =>
                          toggleSubscriber(
                            subscriber.id
                          )
                        }
                        disabled={sendingNewsletter}
                        className="mt-1 h-5 w-5"
                        aria-label={`Select ${subscriber.email}`}
                      />

                      <div className="min-w-0 flex-1">

                        <p className="break-all font-semibold">
                          {subscriber.email}
                        </p>

                        <p className="mt-2 text-sm text-gray-500">
                          {subscriber.subscribed_at
                            ? new Date(
                                subscriber.subscribed_at
                              ).toLocaleDateString("en-NG", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : ""}
                        </p>

                        <button
                          onClick={() =>
                            handleDelete(
                              subscriber.id
                            )
                          }
                          disabled={sendingNewsletter}
                          className="mt-3 font-semibold text-red-600 hover:text-red-700 disabled:opacity-50"
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  </div>
                ))}

              </div>
            </>
          )}

        </section>

      </main>
    </div>
  );
}

export default Newsletter;
