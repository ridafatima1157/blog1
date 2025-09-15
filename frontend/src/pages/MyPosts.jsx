import React, { useContext, useState, useEffect } from "react";
import SideBar from "../components/SideBar";
import { MyContext } from "../Context/MyContext";

import PersonalPosts from "../components/PersonalPosts";

const MyPosts = () => {
  const isOpen = useContext(MyContext);

  return (
    <div className="flex">
      {isOpen && <div className="w-[300px]"><SideBar /></div>}
      {/* Main content */}
      <div className="flex-1"> <PersonalPosts /> </div>

    </div>
  );
};

export default MyPosts;
