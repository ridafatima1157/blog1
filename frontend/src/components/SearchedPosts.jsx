import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";


const SearchedPosts = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      setLoading(true);
      fetch(`http://localhost:8000/api/posts/search?q=${encodeURIComponent(query)}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Error: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => setPosts(data))
        .catch((err) => console.error("Search fetch error:", err))
        .finally(() => setLoading(false));
    }
  }, [query]);

  if (loading) return <p className="p-4">Loading search results...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Search results for "{query}"
      </h1>

      {posts.length === 0 ? (
        <p>No results found</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li
              key={post._id}
              className="p-4 rounded-lg shadow-md bg-white flex"
            >
              {/* Image */}
              <div className="flex-shrink-0 w-[120px] h-[120px] mr-4">
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.title || "Post image"}
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-md text-gray-500 text-sm">
                    No Image
                  </div>
                )}
              </div>

              {/* Post Info */}
              <div className="flex-1">
                {/* Title */}
                <Link
                  to={`/posts/${post._id}`}
                  className="text-xl font-semibold text-blue-700 hover:underline"
                >
                  {post.title}
                </Link>

                {/* Author + Date */}
                <p className="text-gray-600 text-sm">
                  by{" "}
                  <Link
                    to={`/profile/${post.author?._id}`}
                    className="hover:underline text-blue-500"
                  >
                    {post.author?.username || "Unknown"}
                  </Link>{" "}
                  •{" "}
                  <span>
                    {post.createdAt
                      ? new Date(post.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                      : "Unknown date"}
                  </span>
                </p>

                {/* Content preview */}
                <p className="mt-2 text-gray-700 line-clamp-2">
                  {post.content && post.content.length > 150
                    ? post.content.substring(0, 150) + "..."
                    : post.content}
                </p>

                {/* Tags */}
                {post.tags?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {post.tags.map((tag, idx) => (
                      <Link
                        key={idx}
                        to={`/tags/${tag}`}
                        className="text-xs bg-gray-200 px-2 py-1 rounded-md hover:bg-gray-300"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Likes */}
                <p className="mt-2 text-sm text-gray-500">
                  👍 {post.likes?.length || 0} likes
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchedPosts;
