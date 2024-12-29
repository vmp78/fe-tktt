import React, { useState } from "react";

const SongList = ({ songs }) => {
  if (!songs.length) {
    return <p>No songs found.</p>;
  }

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <ul className="song-list">
      {songs.map((song) => (
        <li key={song.id}>
          {/* Title */}
          <h3>{song._source.title}</h3>

          {/* Content */}
          <SongContent content={song._source.content} maxLength={200} />

          {/* Link */}
          <a href={song._source.link} target="_blank" rel="noopener noreferrer">
            Click here
          </a>
        </li>
      ))}
    </ul>
  );
};

const SongContent = ({ content, maxLength }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => setIsExpanded(!isExpanded);

  return (
    <p>
      {isExpanded ? content : truncateText(content, maxLength)}{" "}
      <span
        onClick={handleToggle}
        style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
      >
        {isExpanded ? "Show less" : "Show more"}
      </span>
    </p>
  );
};

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

export default SongList;
