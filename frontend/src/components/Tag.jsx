import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const Tag = () => {
  const { tag } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tag) {
      setLoading(true);
      fetch(`http://localhost:8000/api/posts/tag/${encodeURIComponent(tag)}`)
        .then((res) => {
          if (!res.ok) throw new Error(`Error: ${res.status}`);
          return res.json();
        })
        .then((data) => setPosts(data))
        .catch((err) => console.error("Tag fetch error:", err))
        .finally(() => setLoading(false));
    }
  }, [tag]);

  if (loading) return <p className="p-4">Loading posts for #{tag}...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-extrabold mb-6">
        Posts tagged with "#{tag}"
      </h1>

      {posts.length === 0 ? (
        <p>No posts found</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li
              key={post._id}
              className="p-4 rounded-lg shadow-md bg-white flex"
            >
              {/* Post image */}
              <div className="shadow-md p-2 mr-4">
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.title || "Post image"}
                    className="w-[120px] max-h-[200px] object-cover rounded-md"
                  />
                ) : (
                  <div className="w-[120px] h-[120px] bg-gray-200 flex items-center justify-center rounded-md text-gray-500 text-sm">
                    No Image
                  </div>
                )}
              </div>

              {/* Post details */}
              <div className="flex-1">
                {/* Title */}
                <Link
                  to={`/posts/${post._id}`}
                  className="text-xl font-semibold text-blue-700 hover:underline"
                >
                  {post.title}
                </Link>

                {/* Author + Date */}
                <p className="text-gray-600 text-sm mt-1">
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
                <p className="mt-2 text-gray-700 text-sm">
                  {post.content && post.content.length > 120
                    ? post.content.substring(0, 120) + "..."
                    : post.content}
                </p>

                {/* Tags */}
                {post.tags?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {post.tags.map((t, idx) => (
                      <Link
                        key={idx}
                        to={`/tags/${t}`}
                        className="text-xs bg-gray-200 px-2 py-1 rounded-md hover:bg-gray-300"
                      >
                        #{t}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Tag;
