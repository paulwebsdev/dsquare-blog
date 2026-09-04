import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import PostCard from "./PostCard";

function RelatedPosts({ categoryId, currentPostId }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRelatedPosts() {
      if (!categoryId) {
        setPosts([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("posts")
        .select(`
          id,
          title,
          slug,
          excerpt,
          featured_image,
          published_at,
          categories (
            name,
            slug
          )
        `)
        .eq("category_id", categoryId)
        .eq("status", "published")
        .neq("id", currentPostId)
        .order("published_at", { ascending: false })
        .limit(3);

      if (error) {
        console.error("Related posts error:", error);
        setPosts([]);
      } else {
        setPosts(data || []);
      }

      setLoading(false);
    }

    fetchRelatedPosts();
  }, [categoryId, currentPostId]);

  if (loading) {
    return (
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-gray-950">
          Related Articles
        </h2>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-80 animate-pulse rounded-2xl bg-gray-100"
            />
          ))}
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 border-t border-gray-200 pt-10">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
          Keep Reading
        </p>

        <h2 className="mt-1 text-2xl font-bold text-gray-950">
          Related Articles
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}

export default RelatedPosts;

