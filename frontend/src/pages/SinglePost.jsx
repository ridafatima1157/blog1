import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { formatDistanceToNow } from "date-fns";
import heart from "../assets/heart.png";
import redHeart from "../assets/hearts.png";
import chat from "../assets/chat.png";


function SinglePost() {
  const { id } = useParams(); // get post id from URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const [displayComments, setDisplayComments] = useState(false);

  // store logged-in user
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")); // saved during login
    setCurrentUser(user);
    const fetchPost = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You must be logged in to view this post");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/api/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        setPost(data);
        setLikes(data.likes || 0);
        setIsLiked(data.isLiked || false);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    const fetchComments = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/comments/${id}`);
        const data = await res.json();
        setComments(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPost();
    fetchComments();
  }, [id]);

  const handleLike = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:8000/api/posts/${id}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLikes(data.likes);
      setIsLiked(data.isLiked);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:8000/api/comments/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment }),
      });
      const data = await res.json();
      setComments([...comments, data]);
      setNewComment("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`http://localhost:8000/api/comments/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="pt-[10px] px-[200px] ">
      <div className="flex flex-col items-center bg-white m-3 shadow-[1px_2px_6px_grey] p-7 w-full max-w-4xl">
        <h1 className="text-3xl font-bold ">Title: <span className="text-[#66112e]">{post.title}</span></h1>
        <p className="text-gray-500 mb-4">by {post.author?.username}</p>


        <div className="prose w-[1200px] max-w-none shadow-[1px_2px_6px_grey] rounded-[1px]  ">
          {post.image && (
            <div className="shadow-[1px_2px_6px_grey]">
              <img
                src={post.image}
                alt="Post"
                className="w-full max-h-[550px]"
              />
            </div>
          )}
          <div className=" p-8  shadow-[1px_1px_4px_grey] ">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

        </div>

        {/* Like + Comments Button */}
        <div className="flex gap-6 mt-4">
          <div className="flex flex-col items-center">
            <button onClick={handleLike}>
              {isLiked ? (
                <img src={redHeart} alt="heart" className="w-9 h-9" />
              ) : (
                <img src={heart} alt="heart" className="w-9 h-9" />
              )}
            </button>
            <span>({likes})</span>
          </div>
          <div className="flex flex-col items-center">
            <button
              className="text-white px-3 h-[40px] rounded border-2"
              onClick={() => setDisplayComments(!displayComments)}
            >
              {displayComments
                ? (<img src={chat} alt="chat" className="w-9 h-9" />)

                : (<img src={chat} alt="chat" className="w-9 h-9" />)
              }
            </button>
            <span>({comments.length})</span>
          </div>

        </div>

        {/* Comments Section */}
        {displayComments && (
          <div className="mt-6 w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-2">Comments</h2>
            <ul className="mb-4">
              {comments.map((c) => (
                <li
                  key={c._id}
                  className="shadow-[1px_2px_6px_grey] p-2 rounded-[5px]"
                >
                  <div className="flex justify-between items-center">
                    <span>
                      <span className="font-semibold text-[13px]">
                        {c.author?.username}:
                      </span>{" "}
                      {c.content}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-xs">
                        {formatDistanceToNow(new Date(c.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                      {currentUser?._id === c.author?._id && (
                        <button
                          onClick={() => handleDeleteComment(c._id)}
                          className="text-red-500 text-xs hover:underline"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex">
              <input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="rounded-l-[10px] shadow-[1px_2px_6px_grey] p-2 flex-1"
                placeholder="Write a comment..."
              />
              <button
                onClick={handleAddComment}
                className="bg-[#188a64] text-white px-4 shadow-[1px_2px_6px_grey]  rounded-r-[10px] h-[45px]"
              >
                Post
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SinglePost;
