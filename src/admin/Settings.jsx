import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../services/supabase";

function Settings() {
  const [settingsId, setSettingsId] = useState(null);

  const [siteName, setSiteName] = useState("Dsquare Web Blog");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [authorName, setAuthorName] = useState("Dsquare Web");
  const [logoUrl, setLogoUrl] = useState("");

  const [facebookUrl, setFacebookUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [tiktokUrl, setTiktokUrl] = useState("");

  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSettings() {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Settings error:", error);
        setError(error.message);
      } else if (data) {
        setSettingsId(data.id);

        setSiteName(data.site_name || "Dsquare Web Blog");
        setTagline(data.tagline || "");
        setDescription(data.description || "");
        setContactEmail(data.contact_email || "");
        setAuthorName(data.author_name || "Dsquare Web");
        setLogoUrl(data.logo_url || "");

        setFacebookUrl(data.facebook_url || "");
        setInstagramUrl(data.instagram_url || "");
        setTwitterUrl(data.twitter_url || "");
        setLinkedinUrl(data.linkedin_url || "");
        setTiktokUrl(data.tiktok_url || "");

        setSeoTitle(data.seo_title || "");
        setSeoDescription(data.seo_description || "");
      }

      setLoading(false);
    }

    fetchSettings();
  }, []);

  async function handleSave(e) {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    const settingsData = {
      site_name: siteName.trim(),
      tagline: tagline.trim() || null,
      description: description.trim() || null,
      contact_email: contactEmail.trim() || null,
      author_name: authorName.trim() || "Dsquare Web",
      logo_url: logoUrl.trim() || null,

      facebook_url: facebookUrl.trim() || null,
      instagram_url: instagramUrl.trim() || null,
      twitter_url: twitterUrl.trim() || null,
      linkedin_url: linkedinUrl.trim() || null,
      tiktok_url: tiktokUrl.trim() || null,

      seo_title: seoTitle.trim() || null,
      seo_description: seoDescription.trim() || null,

      updated_at: new Date().toISOString(),
    };

    let result;

    if (settingsId) {
      result = await supabase
        .from("site_settings")
        .update(settingsData)
        .eq("id", settingsId);
    } else {
      result = await supabase
        .from("site_settings")
        .insert(settingsData)
        .select()
        .single();

      if (!result.error && result.data) {
        setSettingsId(result.data.id);
      }
    }

    if (result.error) {
      console.error("Save settings error:", result.error);
      setError(result.error.message);
    } else {
      setMessage("Settings saved successfully!");
    }

    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* HEADER */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link to="/admin" className="text-2xl font-bold">
            Dsquare<span className="text-blue-600">Web</span>
          </Link>

          <Link
            to="/admin"
            className="text-sm font-semibold text-gray-600 hover:text-blue-600"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <p className="font-semibold text-blue-600">ADMIN PANEL</p>

          <h1 className="mt-1 text-3xl font-bold">Site Settings</h1>

          <p className="mt-2 text-gray-600">
            Manage your blog's basic information, social links,
            and default SEO settings.
          </p>
        </div>

        {message && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4">
            <p className="font-medium text-green-700">{message}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="font-medium text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* GENERAL */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">General Information</h2>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Site Name
                </label>

                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="Dsquare Web Blog"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Tagline
                </label>

                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Your blog tagline..."
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Site Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  placeholder="Describe what your blog is about..."
                  className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Contact Email
                </label>

                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Author Name
                </label>

                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Dsquare Web"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Logo URL
                </label>

                <input
                  type="url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />

                {logoUrl && (
                  <img
                    src={logoUrl}
                    alt="Site logo preview"
                    className="mt-4 h-20 w-auto rounded-lg object-contain"
                  />
                )}
              </div>
            </div>
          </section>

          {/* SOCIAL MEDIA */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Social Media</h2>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Facebook URL
                </label>

                <input
                  type="url"
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  placeholder="https://facebook.com/..."
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Instagram URL
                </label>

                <input
                  type="url"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  X / Twitter URL
                </label>

                <input
                  type="url"
                  value={twitterUrl}
                  onChange={(e) => setTwitterUrl(e.target.value)}
                  placeholder="https://x.com/..."
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  LinkedIn URL
                </label>

                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/..."
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  TikTok URL
                </label>

                <input
                  type="url"
                  value={tiktokUrl}
                  onChange={(e) => setTiktokUrl(e.target.value)}
                  placeholder="https://www.tiktok.com/@yourusername"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />

                <p className="mt-2 text-sm text-gray-500">
                  Example: https://www.tiktok.com/@dsquareweb
                </p>
              </div>
            </div>
          </section>

          {/* SEO */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Default SEO</h2>

            <p className="mt-1 text-sm text-gray-500">
              These are default settings for pages that don't have
              their own SEO information.
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Default SEO Title
                </label>

                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Dsquare Web Blog"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Default SEO Description
                </label>

                <textarea
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  rows="4"
                  placeholder="Default description for search engines..."
                  className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </section>

          {/* SAVE */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default Settings;

