import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

function Registration() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleSubmission = async (e) => {
    e.preventDefault();
    setLoading(true);
    //
    try {
      const response = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Registration failed. Please try again.");
        return;
      }
      navigate("/login");

    } catch (error) {
      console.error("Registration error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="mt-[100px] ml-[450px] mr-[450px] pt-[50px] pb-[50px] pl-[30px] pr-[30px] flex justify-center shadow-[1px_2px_6px_grey]">
      <div>
        <h2 className=" text-[25px] font-bold">Create a new Account</h2>
        <br />
        <form onSubmit={handleSubmission}>

          <input type="text" id="username" onChange={(event) => setUsername(event.target.value)} placeholder="Enter Username" className="w-[300px] h-[30px] border-0 border-b-2  focus:outline-none focus:border-[#4d4df8]" />
          <br />  <br />

          <input type="password" id="password" onChange={(event) => setPassword(event.target.value)} placeholder="Enter Password" className="w-[300px] h-[30px] border-0 border-b-2  focus:outline-none focus:border-[#4d4df8]" />
          <br /> <br />

          {loading ? (
            <img
              src="https://media1.tenor.com/images/a6a6686cbddb3e99a5f0b60a829effb3/tenor.gif?itemid=7427055"
              alt="Registering..."
              height="40"
              width="60"
            />
          ) : (
            <button
              disabled={loading}
              type="submit"
              className="p-[10px] pt-[5px] w-[90px] h-[35px] border-0 text-[#ffffff] bg-[#2c64b9]"
            >
              Register
            </button>
          )}

          <br /><br />
          <h4 className="text-sm font-semibold">Already have an account?   <Link to="/login" className="text-[#2c64b9] hover:underline">
            Click here
          </Link></h4>
        </form>
      </div>
    </div>

  );
}

export default Registration;
