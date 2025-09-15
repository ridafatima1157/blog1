import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { MyContext } from "../Context/MyContext";
import SearchBar from "../components/SearchBar";

import sidebarImg from "../assets/menu-bar.png";
import blogging from "../assets/blogging.png";
import defaultProfile from "../assets/profile.png";
import bell from "../assets/notification-bell.png";

function Navbar() {
  const [isOpen, setIsOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    }, 1500);
  };

  return (
    <MyContext.Provider value={isOpen}>
      <div>
        {/* Navbar */}
        <div className="fixed top-0 left-0 w-full bg-[#12122e] h-[60px] flex items-center justify-between z-50">
          <div className="flex">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none m-2"
            >
              <img src={sidebarImg} alt="sidebar" className="w-[25px] h-[30px]" />
            </button>

            <button
              onClick={() => navigate("/mainpage")}
              className="focus:outline-none pb-2 pl-2"
            >
              <img src={blogging} alt="sidebar" className="w-[45px] h-[50px]" />
            </button>
          </div>

          {token ? <SearchBar /> : null}

          {/* Right section */}
          {token ? (
            <div className="flex justify-around w-[350px] relative">
              <ul className="flex justify-around w-full items-center">
                <li>
                  <h4>
                    <Link
                      to="/mainpage"
                      className="no-underline text-[#ffffff] font-bold text-[16px]"
                    >
                      Home
                    </Link>
                  </h4>
                </li>

                <li>
                  <h4>
                    <Link
                      to="/about"
                      className="no-underline text-[#ffffff] font-bold text-[16px]"
                    >
                      About
                    </Link>
                  </h4>
                </li>

                <li>
                  <Link
                    to={"/notifications"}
                    className="no-underline text-[#ffffff] font-bold text-[16px] flex items-center"
                  >
                    <img src={bell} alt="notifications" className="w-[25px] h-[25px]" />
                  </Link>
                </li>

                {/* Profile Dropdown */}
                <li className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="focus:outline-none"
                  >
                    <img
                      src={user?.avatar || defaultProfile}
                      alt="profile"
                      className="w-[30px] h-[30px] rounded-full object-cover"
                    />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg overflow-hidden z-50">

                      <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                      >
                        {loggingOut ? "Logging out..." : "Logout"}
                      </button>
                    </div>
                  )}
                </li>
              </ul>
            </div>
          ) : (
            <div className="ml-auto pr-4">
              <Link
                to={"/login"}
                className="no-underline text-[#ffffff] font-bold text-[16px] flex items-center"
              >
                <img
                  src={defaultProfile}
                  alt="profile"
                  className="w-[30px] h-[30px]"
                />
              </Link>
            </div>
          )}
        </div>

        {/* Page content below navbar */}
        <div className="pt-[60px]">
          <Outlet />
        </div>
      </div>
    </MyContext.Provider>
  );
}

export default Navbar;
