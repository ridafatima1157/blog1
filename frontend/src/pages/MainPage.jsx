import { useContext } from "react";
import SideBar from "../components/SideBar";
import AllPosts from "../components/AllPosts";
import { MyContext } from "../Context/MyContext";

const MainPage = () => {
  const isOpen = useContext(MyContext);

  return (
    <div className="flex">
      {isOpen && <div className="w-[300px]">
        <SideBar />
      </div>}

      <div className="flex-1">
        <AllPosts />
      </div>

    </div>
  );
};

export default MainPage;
