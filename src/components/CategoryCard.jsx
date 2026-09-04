import { Link } from "react-router-dom";

function CategoryCard({ category }) {
  if (!category) return null;

  return (
    <Link
      to={`/category/${category.slug}`}
      className="group block rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl font-bold text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
        {category.name?.charAt(0)?.toUpperCase() || "C"}
      </div>

      <h3 className="mt-5 text-lg font-bold text-gray-950 transition group-hover:text-blue-600">
        {category.name}
      </h3>

      {category.description && (
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">
          {category.description}
        </p>
      )}

      <span className="mt-4 inline-block text-sm font-semibold text-gray-950 transition group-hover:text-blue-600">
        Explore category →
      </span>
    </Link>
  );
}

export default CategoryCard;
