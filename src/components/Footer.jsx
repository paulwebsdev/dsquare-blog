import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../services/supabase";

function Footer() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    async function fetchSettings() {
      const { data, error } = await supabase
        .from("site_settings")
        .select(`
          site_name,
          tagline,
          contact_email,
          facebook_url,
          instagram_url,
          twitter_url,
          linkedin_url,
          tiktok_url
        `)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Footer settings error:", error);
        return;
      }

      setSettings(data);
    }

    fetchSettings();
  }, []);

  const siteName = settings?.site_name || "Dsquare Web Blog";
  const tagline =
    settings?.tagline || "Web, Business, AI & Digital Growth";

  return (
    <footer className="border-t border-gray-200 bg-gray-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          {/* BRAND */}
          <div>
            <Link to="/" className="text-2xl font-bold">
              Dsquare<span className="text-blue-500">Web</span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-gray-400">
              {tagline}
            </p>

            {settings?.contact_email && (
              <a
                href={`mailto:${settings.contact_email}`}
                className="mt-4 inline-block text-sm text-gray-400 hover:text-white"
              >
                {settings.contact_email}
              </a>
            )}
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="font-semibold">Quick Links</h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-gray-400">
              <Link to="/" className="hover:text-white">
                Home
              </Link>

              <Link to="/blog" className="hover:text-white">
                Blog
              </Link>

              <Link to="/about" className="hover:text-white">
                About
              </Link>

              <Link to="/contact" className="hover:text-white">
                Contact
              </Link>
            </div>
          </div>

          {/* SOCIAL MEDIA */}
          <div>
            <h3 className="font-semibold">Follow Us</h3>

            <div className="mt-4 flex flex-wrap gap-3">
              {settings?.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-300 transition hover:border-blue-500 hover:text-white"
                >
                  Facebook
                </a>
              )}

              {settings?.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-300 transition hover:border-pink-500 hover:text-white"
                >
                  Instagram
                </a>
              )}

              {settings?.twitter_url && (
                <a
                  href={settings.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-300 transition hover:border-gray-500 hover:text-white"
                >
                  X
                </a>
              )}

              {settings?.linkedin_url && (
                <a
                  href={settings.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-300 transition hover:border-blue-500 hover:text-white"
                >
                  LinkedIn
                </a>
              )}

              {settings?.tiktok_url && (
                <a
                  href={settings.tiktok_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-300 transition hover:border-gray-500 hover:text-white"
                >
                  TikTok
                </a>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-10 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>

          <div className="mt-3 flex justify-center gap-4">
            <Link to="/privacy" className="hover:text-white">
              Privacy
            </Link>

            <Link to="/terms" className="hover:text-white">
              Terms
            </Link>

            <Link to="/disclaimer" className="hover:text-white">
              Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

