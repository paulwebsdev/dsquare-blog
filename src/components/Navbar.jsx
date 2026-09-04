import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { supabase } from "../services/supabase";

function Navbar() {
  const [settings, setSettings] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      const { data, error } = await supabase
        .from("site_settings")
        .select("site_name, logo_url")
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Navbar settings error:", error);
        return;
      }

      setSettings(data);
    }

    fetchSettings();
  }, []);

  const siteName = settings?.site_name || "Dsquare Web Blog";

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* LOGO / SITE NAME */}
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-3"
        >
          {settings?.logo_url ? (
            <img
              src={settings.logo_url}
              alt={siteName}
              className="h-10 w-10 rounded-lg object-contain"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-950 text-sm font-bold text-white">
              DW
            </div>
          )}

          <span className="text-xl font-bold tracking-tight text-gray-950">
            {siteName}
          </span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-semibold transition ${
                  isActive
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-950"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          <Link
            to="/search"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-950 hover:text-gray-950"
          >
            Search
          </Link>
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-gray-700 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* MOBILE NAVIGATION */}
      {menuOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-6 py-4">

            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `border-b border-gray-100 py-4 text-sm font-semibold ${
                    isActive
                      ? "text-blue-600"
                      : "text-gray-700"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            <Link
              to="/search"
              onClick={() => setMenuOpen(false)}
              className="mt-4 rounded-lg bg-gray-950 px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Search
            </Link>

          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
