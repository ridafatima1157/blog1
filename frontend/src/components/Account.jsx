import { useState, useEffect } from "react";
import profile from "../assets/profile.png";

export default function Account({ canEdit = false, userData, postCount = 0 }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!userData || !loggedInUser) return;
    setIsFollowing(userData.followers?.includes(loggedInUser._id));
  }, [userData, loggedInUser]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("avatar", selectedFile);

      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/users/avatar", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");

      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (currentUser?._id === data._id) {
        localStorage.setItem("user", JSON.stringify(data));
      }

      alert("✅ Profile picture updated!");
      setPreview(null);
      setSelectedFile(null);
      window.location.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!loggedInUser || !userData) return;
    setFollowLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:8000/api/users/${userData._id}/${isFollowing ? "unfollow" : "follow"
        }`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Action failed");

      // Update state locally
      setIsFollowing(!isFollowing);
      userData.followers = isFollowing
        ? userData.followers.filter((id) => id !== loggedInUser._id)
        : [...(userData.followers || []), loggedInUser._id];
    } catch (err) {
      console.error(err);
      alert("Error performing action: " + err.message);
    } finally {
      setFollowLoading(false);
    }
  };

  const avatarSrc = preview || userData?.avatar || profile;

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-2xl shadow-lg">
      <div className="flex flex-col items-center">
        <img
          src={avatarSrc}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-gray-200"
        />
        <h2 className="text-xl font-bold">{userData?.username || "Unknown"}</h2>
        <p className="text-gray-500 mb-4">{userData?.email}</p>

        {/* Upload avatar */}
        {canEdit && (
          <div className="flex flex-col items-center gap-3 w-full">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-700
                file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                file:text-sm file:font-semibold file:bg-blue-50
                file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
            <button
              onClick={handleUpload}
              disabled={!selectedFile || loading}
              className={`px-4 py-2 rounded-xl w-full text-white transition ${!selectedFile || loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {loading ? "Uploading..." : "Update Profile Picture"}
            </button>
            {error && <p className="text-red-500 text-sm">❌ {error}</p>}
          </div>
        )}

        {/* Follow / Unfollow */}
        {!canEdit && loggedInUser?._id !== userData?._id && (
          <button
            onClick={handleFollowToggle}
            disabled={followLoading}
            className={`px-4 py-2 rounded-xl w-full text-white mt-4 transition ${isFollowing
                ? "bg-gray-500 hover:bg-gray-600"
                : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {followLoading
              ? "Processing..."
              : isFollowing
                ? "Following"
                : "Follow"}
          </button>
        )}

        {/* Stats */}
        <div className="flex justify-around mt-6 w-full text-center">
          <div>
            <h1 className="text-lg font-semibold">{postCount}</h1>
            <p className="text-sm text-gray-500">Posts</p>
          </div>
          <div>
            <h1 className="text-lg font-semibold">
              {userData?.followers?.length || 0}
            </h1>
            <p className="text-sm text-gray-500">Followers</p>
          </div>
          <div>
            <h1 className="text-lg font-semibold">
              {userData?.following?.length || 0}
            </h1>
            <p className="text-sm text-gray-500">Following</p>
          </div>
        </div>
      </div>
    </div>
  );
}
