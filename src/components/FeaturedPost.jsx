import { Link } from "react-router-dom";

function FeaturedPost({ post }) {
  if (!post) return null;

  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <article className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:shadow-xl">
      <div className="grid md:grid-cols-2">

        {/* IMAGE */}
        <Link
          to={`/blog/${post.slug}`}
          className="block overflow-hidden bg-gray-100"
        >
          {post.featured_image ? (
            <img
              src={post.featured_image}
              alt={post.title}
              className="h-full min-h-[280px] w-full object-cover transition duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full min-h-[280px] items-center justify-center">
              <span className="text-sm font-medium text-gray-400">
                Dsquare Web Blog
              </span>
            </div>
          )}
        </Link>

        {/* CONTENT */}
        <div className="flex flex-col justify-center p-7 md:p-10">

          {/* FEATURED LABEL */}
          <span className="mb-4 w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-600">
            Featured
          </span>

          {/* CATEGORY */}
          {post.categories?.name && (
            <Link
              to={`/category/${post.categories.slug}`}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              {post.categories.name}
            </Link>
          )}

          {/* TITLE */}
          <h1 className="mt-3 text-2xl font-bold leading-tight text-gray-950 md:text-3xl">
            <Link
              to={`/blog/${post.slug}`}
              className="transition hover:text-blue-600"
            >
              {post.title}
            </Link>
          </h1>

          {/* EXCERPT */}
          {post.excerpt && (
            <p className="mt-4 line-clamp-4 leading-7 text-gray-600">
              {post.excerpt}
            </p>
          )}

          {/* DATE */}
          <div className="mt-6 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {formattedDate}
            </span>

            <Link
              to={`/blog/${post.slug}`}
              className="font-semibold text-gray-950 transition hover:text-blue-600"
            >
              Read article →
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export default FeaturedPost;
