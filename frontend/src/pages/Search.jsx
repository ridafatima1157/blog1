import React, { useContext } from "react";
import { MyContext } from "../Context/MyContext";
import SearchedPosts from "../components/SearchedPosts";
import SideBar from "../components/SideBar";
function Search() {
  const isOpen = useContext(MyContext);

  return (


    <div className="flex ">
      {isOpen && <div className="w-[300px]"><SideBar /></div>}
      {/* Main content */}
      <div className="flex-1"> <SearchedPosts /> </div>

    </div>
  );
}

export default Search;
