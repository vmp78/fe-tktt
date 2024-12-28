// Hàm thực hiện tìm kiếm
async function fetchSearchResults(query) {
  try {
    resultsContainer.innerHTML = "<p>Loading...</p>"; // Thay đổi thông báo loading

    const response = await fetch(`${apiUrl}?q=${encodeURIComponent(query)}`);
    const results = await response.json();

    if (!results || results.length === 0) {
      resultsContainer.innerHTML = "<p>No results found.</p>";
      return;
    }

    displayResults(results);
  } catch (err) {
    console.error("Error fetching search results:", err);
    resultsContainer.innerHTML =
      "<p>An error occurred. Please try again later.</p>";
  }
}

// Hàm hiển thị kết quả
function displayResults(songs) {
  resultsContainer.innerHTML = "";

  songs.forEach((song) => {
    const dataDetail = song._source || song; // Adjust for API structure

    // Tạo HTML cho thẻ song card
    songCard.innerHTML = `
      <h3>${dataDetail.title}</h3>
      <div class="lyrics-section">
        <button class="toggle-lyrics">Details</button>
        <div class="content" style="display: none">
          ${dataDetail.content}<br>
        </div>
      </div>
      <a href="${dataDetail.link || "#"}" target="_blank">Link</a>
    `;

    // Xử lý sự kiện toggle lyrics
    const toggleButton = songCard.querySelector(".toggle-lyrics");
    const lyricsContent = songCard.querySelector(".content");

    toggleButton.addEventListener("click", () => {
      const isVisible = lyricsContent.style.display === "block";
      lyricsContent.style.display = isVisible ? "none" : "block";
      toggleButton.textContent = isVisible ? "Details" : "Hide";
    });

    resultsContainer.appendChild(songCard);
  });
}

// API URL
const apiUrl = "http://localhost:3000/api/songs/search";

// Các phần tử DOM
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const resultsContainer = document.getElementById("results");

// Sự kiện nhấn nút tìm kiếm
searchButton.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    fetchSearchResults(query);
  } else {
    alert("Please enter a search term.");
  }
});

// Gán sự kiện Enter vào ô nhập liệu
searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    searchButton.click(); // Gọi sự kiện click của nút "Search"
  }
});
