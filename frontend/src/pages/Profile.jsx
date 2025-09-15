import React, { useContext } from "react";
import SideBar from "../components/SideBar";
import { MyContext } from "../Context/MyContext";
import Profiles from "../components/Profiles";

export default function Profile() {
  const isOpen = useContext(MyContext);

  return (
    <div className="flex">
      {isOpen && <div className="w-[300px]"><SideBar /></div>}
      {/* Main content */}
      <div className="flex-1"> <Profiles /> </div>

    </div>
  );
}
//