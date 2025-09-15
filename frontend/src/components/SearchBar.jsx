import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setQuery("");
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex">
      <input
        type="text"
        placeholder="Explore the blog..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="bg-white rounded-l-[10px] w-[380px] h-[40px] p-[10px] focus:outline-none"
      />
      <button
        type="submit"
        className="bg-[#188a64] text-white rounded-r-[10px] w-[80px] h-[40px]"
      >
        Search
      </button>
    </form>
  );
}

export default SearchBar;
