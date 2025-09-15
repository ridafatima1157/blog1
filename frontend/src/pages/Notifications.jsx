import { useContext } from "react";
import SideBar from "../components/SideBar";
import Notify from "../components/notify";
import { MyContext } from "../Context/MyContext";

export default function Notifications() {
  const isOpen = useContext(MyContext);

  return (
    <div className="flex ">
      {isOpen && (
        <div className="w-[300px]">
          <SideBar />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1">
        <Notify />
      </div>
    </div>
  );
}
