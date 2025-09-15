import Tag from "../components/Tag";
import { useContext } from "react";
import SideBar from "../components/SideBar";
import { MyContext } from "../Context/MyContext";

export default function TagPosts() {
  const isOpen = useContext(MyContext);

  return (
    <div className="flex">
      {isOpen && <div className="w-[300px]"><SideBar /></div>}
      {/* Main content */}
      <div className="flex-1">  <Tag /> </div>
    </div>

  );
}
