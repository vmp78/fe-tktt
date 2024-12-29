import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import SongList from "../components/SongList";
import { searchSongs } from "../api/songs";

const HomePage = () => {
  const [songs, setSongs] = useState([]);

  const handleSearch = async (query) => {
    try {
      const results = await searchSongs(query);
      setSongs(results);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="home-page">
      <h1>
  <span role="img" aria-label="music-note">🎵</span> Song Search
</h1>

      <SearchBar onSearch={handleSearch} />
      <SongList songs={songs} />
    </div>
  );
};

export default HomePage;
