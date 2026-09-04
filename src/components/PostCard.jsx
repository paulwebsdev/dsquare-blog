import { Link } from "react-router-dom";

function PostCard({ post }) {
  if (!post) return null;

  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* IMAGE */}
      {post.featured_image ? (
        <Link to={`/blog/${post.slug}`}>
          <div className="aspect-video overflow-hidden bg-gray-100">
            <img
              src={post.featured_image}
              alt={post.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        </Link>
      ) : (
        <Link to={`/blog/${post.slug}`}>
          <div className="flex aspect-video items-center justify-center bg-gray-100">
            <span className="text-sm font-medium text-gray-400">
              Dsquare Web Blog
            </span>
          </div>
        </Link>
      )}

      {/* CONTENT */}
      <div className="p-6">
        {/* CATEGORY */}
        {post.categories?.name && (
          <Link
            to={`/category/${post.categories.slug}`}
            className="text-xs font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700"
          >
            {post.categories.name}
          </Link>
        )}

        {/* TITLE */}
        <h2 className="mt-2 text-xl font-bold leading-tight text-gray-950">
          <Link
            to={`/blog/${post.slug}`}
            className="transition hover:text-blue-600"
          >
            {post.title}
          </Link>
        </h2>

        {/* EXCERPT */}
        {post.excerpt && (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
            {post.excerpt}
          </p>
        )}

        {/* DATE + READ MORE */}
        <div className="mt-5 flex items-center justify-between gap-4">
          <span className="text-xs text-gray-500">
            {formattedDate}
          </span>

          <Link
            to={`/blog/${post.slug}`}
            className="text-sm font-semibold text-gray-950 hover:text-blue-600"
          >
            Read more →
          </Link>
        </div>
      </div>
    </article>
  );
}

export default PostCard;
