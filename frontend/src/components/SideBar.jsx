import { Link } from "react-router-dom";

function SideBar() {
  const token = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="fixed top-[60px] left-0 h-[calc(100vh-60px)] w-[300px] backdrop-blur-2xl shadow-[1px_2px_6px_grey] flex flex-col p-4 ">


      <Link
        className="text-center shadow-[1px_1px_3px_grey] mt-[10px] ml-[10px] mb-[40px] font-bold rounded-[30px] w-[130px] p-1 text-[#0a1a77] "
        to="/posts/new"
      ><span className="text-[20px]">+</span> NEW POST</Link>

      <div className="border-1 border-b border-[#a2a3a2] mb-[10px]"></div>

      <Link
        className="p-[10px] m-[10px] font-bold text-[#0a1a77] hover:text-blue-500 transition-colors duration-300"
        to="/mainpage"
      >
        Home
      </Link>

      <Link
        className=" p-[10px] m-[10px] font-bold hover:text-blue-500 transition-colors duration-300"
        to={`/profile/${token._id}`}
      >
        My Posts
      </Link>
      <Link
        className=" p-[10px] m-[10px] font-bold hover:text-blue-500 transition-colors duration-300"
        to="/notifications"
      >
        Notifications
      </Link>
      <Link
        className=" p-[10px] m-[10px] font-bold hover:text-blue-500 transition-colors duration-300"
        to="/settings"
      >
        Settings
      </Link>
    </div>
  );
}

export default SideBar;
