import { Link } from "react-router-dom";

function Home() {

  return (
    <div className="w-full h-[580px] overflow-hidden  bg-[#e2e2e7]">
      <div className={"backdrop-blur-2xl shadow-[1px_2px_6px_grey] h-[100%] flex flex-col justify-center items-center"}>
        <h1 className="text-8xl font-bold text-[#23282b] bubbly-font">
          Welcome to the Blog
        </h1>

        <br /><br />
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
          <span className="italic">Read and Write Stories</span>
        </h1>
        <p className="text-center text-gray-600">
          Share your thoughts, experiences, and creativity with the world.
        </p>
        <br />
        <Link to="/reg" className="bg-[#2c883c] text-white border border-gray-400  rounded-[6px] w-[150px] h-[43px] text-center pt-[6px]"><span className="font-semibold">Get Started</span></Link>
      </div>
    </div>
  );
}

export default Home;
