// script.js
const extractTitle = (data) => {
  return (
    data.poemName ||
    data.test_title ||
    data.animalName ||
    data.blogName ||
    data.song ||
    data.title ||
    data.newsName ||
    data.tenchude ||
    data.vietnamese_name ||
    "No Title"
  );
};

// Hàm để trích xuất nội dung
const extractContent = (data) => {
  const content = [
    data.description ?? "",
    data.meaning ?? "",
    data.code ?? "",
    data.lyrics ?? "",
    data.noidung ?? "",
    data.paragram ?? "",
    data.content ?? "",
    data.Content ?? "",
  ]
    .filter(Boolean) // Lọc các trường không phải là null, undefined hoặc chuỗi rỗng
    .join("<br><br><br>"); // Nối các trường lại với nhau, mỗi trường cách nhau bằng <br>

  return content;
};

// Hàm trích xuất tiêu đề phụ
const extractSubTitle = (data) => {
  const title =
    (data.alt_name ?? "") +
    " " +
    (data.timeAgo ?? "") +
    " " +
    (data.date ?? "") +
    " " +
    (data.type ?? "") +
    " " +
    (data.author ?? "") +
    " " +
    ((data.tendieu ?? "") +
      " " +
      (data.tendemuc ?? "") +
      " " +
      (data.tenchuong ?? "")) +
    " " +
    (data["Poem Form"] ?? "") +
    " " +
    (data.artists ?? "");
  return title;
};

// Hàm trích xuất các thông tin bổ sung
const extractAdditional = (data) => {
  const add = [
    (data.classify ?? []).join(", "),
    (data.categories ?? []).join(", "),
    data.tags ?? "",
    data.keywords ?? "",
    data.category ?? "",
    data.status ?? "",
  ]
    .filter(Boolean) // Lọc bỏ các giá trị rỗng
    .join(", "); // Nối các trường lại bằng dấu phẩy
  return add;
};

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

    const title = extractTitle(dataDetail);
    const content = extractContent(dataDetail).replace(/\n/g, "<br>");
    const subTitle = extractSubTitle(dataDetail);
    const add = extractAdditional(dataDetail);

    const songCard = document.createElement("div");
    songCard.className = "song-card";

    // Tạo HTML cho thẻ <img> nếu có image
    let imageHTML = "";
    if (dataDetail.first_img) {
      imageHTML = `
        <div style="text-align: center">
          <img 
            src="${dataDetail.first_img}" 
            alt="Description" 
            style="width: 600px; height: auto;" 
          />
        </div>
        <br>
      `;
    }

    // Tạo HTML cho thẻ song card
    songCard.innerHTML = `
      <h3>${title}</h3>
      <div style="margin-top: 0.5px;">
        <p>${subTitle}</p>
      </div>
      <div class="lyrics-section">
        <button class="toggle-lyrics">Details</button>
        <div class="content" style="display: none">
          ${imageHTML}<br>
          ${content}<br><br>
          Tags: ${add}
        </div>
      </div>
      <a href="${
        dataDetail.link ||
        dataDetail.Link ||
        dataDetail.url ||
        dataDetail.comments ||
        "#"
      }" target="_blank">Link</a>
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
