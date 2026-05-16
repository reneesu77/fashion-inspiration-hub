const grid = document.getElementById("cardGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

let inspirations = [];

const categoryNames = {
  embroidery: "刺繡工藝",
  print: "印花圖案",
  kids: "童裝圖案",
  trend: "流行趨勢",
  fabric: "布料材質",
  market: "市場商品"
};

async function loadInspirations() {
  try {
    const response = await fetch("data/inspirations.json");

    if (!response.ok) {
      throw new Error("資料載入失敗");
    }

    inspirations = await response.json();
    renderCards(inspirations);
  } catch (error) {
    grid.innerHTML = `
      <div class="empty">
        目前無法載入靈感資料，請確認 data/inspirations.json 是否已建立。
      </div>
    `;
  }
}

function renderCards(items) {
  if (!items.length) {
    grid.innerHTML = `<div class="empty">找不到符合條件的靈感資料。</div>`;
    return;
  }

  grid.innerHTML = items
    .map((item) => {
      const tags = item.tags
        .map((tag) => `<span class="tag">${tag}</span>`)
        .join("");

      return `
        <article class="card">
          <div class="card-image">
            <img src="${item.image}" alt="${item.title}" loading="lazy">
          </div>

          <div class="card-body">
            <span class="badge">${categoryNames[item.category] || item.category}</span>
            <h2>${item.title}</h2>
            <p>${item.description}</p>

            <div class="tags">
              ${tags}
            </div>

            <a href="${item.source}" target="_blank" rel="noopener noreferrer">
              查看來源
            </a>
          </div>
        </article>
      `;
    })
    .join("");
}

function filterItems() {
  const keyword = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;

  const filtered = inspirations.filter((item) => {
    const matchCategory = category === "all" || item.category === category;

    const searchableText = [
      item.title,
      item.description,
      item.category,
      ...item.tags
    ]
      .join(" ")
      .toLowerCase();

    const matchKeyword = searchableText.includes(keyword);

    return matchCategory && matchKeyword;
  });

  renderCards(filtered);
}

searchInput.addEventListener("input", filterItems);
categoryFilter.addEventListener("change", filterItems);

loadInspirations();
