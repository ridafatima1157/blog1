import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MarkdownEditor from "../components/MarkdownEditor";

function CreatePost() {
  const { id } = useParams(); // post ID if editing
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState(""); // Comma-separated string
  const [imageUrl, setImageUrl] = useState(""); // Uploaded image URL
  const [uploading, setUploading] = useState(false); // Upload status

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch existing post data if editing
  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8000/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setTitle(data.title);
          setContent(data.content);
          setTags(data.tags?.join(", ") || "");
          setImageUrl(data.image || ""); // prefill image if exists
        })
        .catch((err) => console.error(err));
    }
  }, [id]);

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    // Log what is being sent
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    setUploading(true);
    try {
      const res = await fetch("http://localhost:8000/api/image/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Image upload failed");

      const data = await res.json();
      setImageUrl(data.imageUrl);
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };



  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = id
      ? `http://localhost:8000/api/posts/${id}` // update
      : "http://localhost:8000/api/posts"; // create new

    const method = id ? "PUT" : "POST";

    // Convert tags string → array
    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          tags: tagsArray,
          imageUrl, // send imageUrl key to match backend
        }),

      });

      if (!response.ok) throw new Error("Failed to save post");

      alert(id ? "Post updated!" : "Post created!");
      navigate(`/profile/${user._id}`);
    } catch (err) {
      console.error(err);
      alert("Error saving post");
    }
  };

  return (
    <div>
      <div className="backdrop-blur-2xl shadow-[1px_2px_6px_grey] flex flex-col justify-center items-center m-9">
        <h2 className="text-3xl font-extrabold mb-4 ml-4 mt-4">
          {id ? "EDIT YOUR POST" : "CREATE YOUR POST"}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="flex justify-center">
            <input
              className="bg-white h-[30px] w-[500px] border-0 border-b-2 p-4 focus:outline-none focus:border-[#4d4df8]"
              placeholder="Post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Tags input */}
          <div className="flex justify-center mt-4">
            <input
              className="bg-white h-[30px] w-[500px] border-0 border-b-2 p-4 focus:outline-none focus:border-[#4d4df8]"
              placeholder="Add tags (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          {/* Image upload */}
          <div className="flex justify-center mt-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files[0]) {
                  handleImageUpload(e.target.files[0]);
                }
              }}
            />
          </div>
          {uploading && (
            <p className="text-sm text-gray-500 mt-2">Uploading image...</p>
          )}
          {imageUrl && (
            <div className="flex justify-center mt-2">
              <img
                src={imageUrl}
                alt="Uploaded preview"
                className="w-40 h-40 object-cover rounded"
              />
            </div>
          )}

          {/* Content editor */}
          <MarkdownEditor content={content} setContent={setContent} />

          {/* Submit button */}
          <div className="flex justify-center mt-2">
            <button
              type="submit"
              className="bg-[#188a64] text-white border border-gray-400 rounded-[10px] w-[80px] h-[35px] m-2"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;
