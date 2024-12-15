const extractContent = (data) => {
  const content = [
    data.description ?? "",
    data.meaning ?? "",
    data.code ?? "",
    data.lyrics ?? "",
    data.noidung ?? "",
    data.paragram ?? "",
    data.content ?? "",
    data.Content ?? ""
  ]
    .filter(Boolean) // Lọc các trường không phải là null, undefined hoặc chuỗi rỗng
    .join("<br><br><br>"); // Nối các trường lại với nhau, mỗi trường cách nhau bằng <br>

  return content;
};


const extractSubTitle = (data) => {
  const title =
  (data.alt_name ?? "") + " " +  // blog, nettruyen
  (data.timeAgo ?? "") + " " +   // data
  (data.date ?? "") + " " +      // data1, data2
  (data.type ?? "") + " " +      // data3
  (data.author ?? "") + " " +  // data5, nettruyen    
  ((data.tendieu ?? "") + " " +   // phap_dien
  (data.tendemuc ?? "") + " " +   // phap_dien
  (data.tenchuong ?? "")) + " " + // phapdien
  (data["Poem Form"] ?? "") + " " + //poem-demo
  (data.artists ?? "")            // songs
  return title;
};

const extractAdditional = (data) => {
  const add =
    (data.classify ?? "") + " " +  // animal
    (data.categories ?? "") + " " +  // animal
    (data.tags ?? "") + " " +      //blog,nettruyen
    (data.keywords ?? "") + " " +      // data
    (data.category ?? "") + " " + // data5
    (data.status ?? "") // nettruyen
  return add;
};

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
    resultsContainer.innerHTML =
      "<p>An error occurred. Please try again later.</p>";
  }
}

function displayResults(songs) {
  resultsContainer.innerHTML = "";

  songs.forEach((song) => {
    const dataDetail = song._source || song; // Adjust for API structure

    const content = extractContent(dataDetail).replace(/\n/g, "<br>");
    const subTitle = extractSubTitle(dataDetail);
    const add = extractAdditional(dataDetail)

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

    // Tạo HTML cho thẻ 
    songCard.innerHTML = `
      <h3>${
        dataDetail.song ||
        dataDetail.title ||
        dataDetail.content ||
        dataDetail.tenchude ||
        dataDetail.scientific_name ||
        dataDetail.Title
      }</h3>
      <p>${subTitle}</p>
      <div class="lyrics-section">
        <button class="toggle-lyrics">Details</button>
        <div class="content" style="display: none">
          ${imageHTML}<br>
          ${content}<br><br>
          Tags: ${add}
          ${""}

        </div>
      </div>
      <a href="${dataDetail.link || dataDetail.Link || dataDetail.url ||dataDetail.comments|| '#'}" target="_blank">Link</a>
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
