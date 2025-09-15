import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Account from "./Account";

const Profiles = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const isOwnProfile = loggedInUser?._id === userId;

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      let url;

      if (isOwnProfile) {
        // If it's own profile → fetch "my posts"
        url = "http://localhost:8000/api/posts/me";
      } else {
        // If it's someone else → fetch that user's posts
        url = `http://localhost:8000/api/posts/user/${userId}`;
      }

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

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


  useEffect(() => {
    if (!userId) return;
    setLoading(true);

    // Fetch profile data
    fetch(`http://localhost:8000/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => setUserData(data))
      .catch((err) => console.error(err));

    // Fetch posts
    fetchPosts();
  }, [userId]);


  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    setDeletingId(id);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8000/api/posts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to delete post");
      setPosts(posts.filter((post) => post._id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting post");
    } finally {
      setDeletingId(null);
    }
  };


  const handleEdit = (id) => {
    navigate(`/posts/edit/${id}`);
  };


  if (loading) return <p className="p-4">Loading profile...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-6">
      {/* Account component */}
      <Account
        userData={userData}
        postCount={posts.length}
        canEdit={isOwnProfile}
      />

      <h1 className="text-3xl font-extrabold mb-6 mt-6">
        {isOwnProfile ? "My Posts" : "Posts"}
      </h1>

      {posts.length === 0 ? (
        <p className="text-gray-500">
          {isOwnProfile
            ? "You haven't created any posts yet."
            : "This user hasn’t posted anything yet."}
        </p>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li
              key={post._id}
              className="p-4 rounded-md shadow-md shadow-gray-300 hover:shadow-lg transition w-full flex justify-between items-center"
            >
              {/* Left Section: Image + Post Info */}
              <div className="flex">
                <div className="flex-shrink-0 w-[120px]">
                  {post.image ? (
                    <img
                      src={post.image}
                      alt={post.title || "Post image"}
                      className="w-[120px] h-[120px] object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-[120px] h-[120px] bg-gray-200 flex items-center justify-center rounded-md text-gray-500 text-sm">
                      No Image
                    </div>
                  )}
                </div>

                {/* Post Info */}
                <div className="ml-4">
                  <Link
                    to={`/posts/${post._id}`}
                    className="text-xl font-semibold text-blue-700 hover:underline"
                  >
                    {post.title}
                  </Link>

                  <p className="text-gray-500 text-sm">
                    by {post.author?.username || userData?.username || "Unknown"} •{" "}
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

                  <p className="mt-2 text-gray-700 line-clamp-2">{post.content}</p>

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

              {isOwnProfile && (
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(post._id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post._id)}
                    disabled={deletingId === post._id}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                  >
                    {deletingId === post._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Profiles;
