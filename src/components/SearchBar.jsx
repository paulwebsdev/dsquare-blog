import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function SearchBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [query, setQuery] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setQuery(params.get("q") || "");
  }, [location.search]);

  function handleSubmit(e) {
    e.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      navigate("/search");
      return;
    }

    navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-2xl items-center gap-2"
    >
      <div className="relative flex-1">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles..."
          aria-label="Search articles"
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        />

        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </span>
      </div>

      <button
        type="submit"
        className="rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
      >
        Search
      </button>
    </form>
  );
}

export default SearchBar;

