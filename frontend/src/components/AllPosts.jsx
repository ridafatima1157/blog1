import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:8000/api/posts");

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        setPosts(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-9">
      <h2 className="text-3xl font-extrabold mb-6">What's New</h2>

      <ul className="mt-4 space-y-3">
        {posts.map((post) => (
          <li
            key={post._id}
            className="p-4 rounded-md bg-white shadow-md hover:shadow-lg transition w-full flex justify-between items-center"
          >
            <div className="flex">
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

              {/* Post info */}
              <div>
                {/* Title */}
                <Link
                  to={`/posts/${post._id}`}
                  className="text-[22px] font-semibold text-[#0a1a77] hover:underline"
                >
                  {post.title}
                </Link>

                {/* Author + Date */}
                <p className="text-gray-500 text-sm">
                  by{" "}
                  <Link
                    to={`/profile/${post.author?._id}`}
                    className="text-blue-500 hover:underline"
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
                    {post.tags.map((tag, i) => (
                      <Link
                        key={i}
                        to={`/tags/${tag}`}
                        className="text-xs bg-gray-200 px-2 py-1 rounded-md hover:bg-gray-300"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AllPosts;
