const apiUrl = "http://localhost:3000/api/songs/search";
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const resultsContainer = document.getElementById("results");

searchButton.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    fetchSearchResults(query);
  } else {
    alert("Please enter a search term.");
  }
});

async function fetchSearchResults(query) {
  try {
    resultsContainer.innerHTML = "<p>Loading...</p>";

    const response = await fetch(`${apiUrl}?q=${encodeURIComponent(query)}`);
    const results = await response.json();

    if (!results || results.length === 0) {
      resultsContainer.innerHTML = "<p>No results found.</p>";
      return;
    }

    displayResults(results);
  } catch (err) {
    console.error("Error fetching search results:", err);
    resultsContainer.innerHTML = "<p>An error occurred. Please try again later.</p>";
  }
}

function displayResults(songs) {
  resultsContainer.innerHTML = "";

  songs.forEach((song) => {
    const songDetails = song._source || song; // Adjust for API structure
    const formattedLyrics = (songDetails.lyrics || "N/A").replace(/\n/g, "<br>");

    const songCard = document.createElement("div");
    songCard.className = "song-card";
    songCard.innerHTML = `
      <h3>${songDetails.song || "Unknown Song"}</h3>
      <p><strong>Artist:</strong> ${songDetails.artists || "Unknown Artist"}</p>
      <div class="lyrics-section">
        <button class="toggle-lyrics">Show Lyrics</button>
        <div class="lyrics-content" style="display: none;">
          ${formattedLyrics}
        </div>
      </div>
      <a href="${songDetails.link || "#"}" target="_blank">Listen here</a>
    `;

    const toggleButton = songCard.querySelector(".toggle-lyrics");
    const lyricsContent = songCard.querySelector(".lyrics-content");

    toggleButton.addEventListener("click", () => {
      const isVisible = lyricsContent.style.display === "block";
      lyricsContent.style.display = isVisible ? "none" : "block";
      toggleButton.textContent = isVisible ? "Show Lyrics" : "Hide Lyrics";
    });

    resultsContainer.appendChild(songCard);
  });
}
