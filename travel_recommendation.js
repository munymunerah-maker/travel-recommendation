let travelData = null;

fetch("travel_recommendation_api.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    travelData = data;
  })
  .catch((error) => {
    console.error("Error fetching travel recommendations:", error);
  });

function createRecommendationCard(item) {
  const card = document.createElement("div");
  card.className = "recommendation-card";

  const img = document.createElement("img");
  img.src = item.imageUrl;
  img.alt = item.name;

  const content = document.createElement("div");
  content.className = "card-content";

  const title = document.createElement("h3");
  title.textContent = item.name;

  const description = document.createElement("p");
  description.textContent = item.description;

  const visitBtn = document.createElement("button");
  visitBtn.type = "button";
  visitBtn.className = "visit-btn";
  visitBtn.textContent = "Visit";

  content.appendChild(title);
  content.appendChild(description);
  content.appendChild(visitBtn);

  card.appendChild(img);
  card.appendChild(content);

  return card;
}

function displayRecommendations(items) {
  const resultsContainer = document.getElementById("resultsContainer");
  if (!resultsContainer) return;

  resultsContainer.innerHTML = "";

  if (!items || items.length === 0) {
    resultsContainer.innerHTML =
      '<p class="no-results">No matching destinations found. Try searching for "beach", "temple", or "country".</p>';
    return;
  }

  items.forEach((item) => {
    resultsContainer.appendChild(createRecommendationCard(item));
  });
}

function handleSearch() {
  const inputEl = document.getElementById("searchInput");
  if (!inputEl) return;

  const query = inputEl.value.trim().toLowerCase();
  if (!query) {
    displayRecommendations([]);
    return;
  }

  if (!travelData) {
    displayRecommendations([]);
    return;
  }

  let matchedItems = [];

  if (query.includes("beach")) {
    matchedItems = travelData.beaches || [];
  } else if (query.includes("temple")) {
    matchedItems = travelData.temples || [];
  } else if (query.includes("country") || query.includes("countries")) {
    (travelData.countries || []).forEach((country) => {
      if (Array.isArray(country.cities)) {
        matchedItems = matchedItems.concat(country.cities);
      }
    });
  } else {
    (travelData.beaches || []).forEach((item) => {
      if (
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      ) {
        matchedItems.push(item);
      }
    });

    (travelData.temples || []).forEach((item) => {
      if (
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      ) {
        matchedItems.push(item);
      }
    });

    (travelData.countries || []).forEach((country) => {
      (country.cities || []).forEach((city) => {
        if (
          city.name.toLowerCase().includes(query) ||
          city.description.toLowerCase().includes(query)
        ) {
          matchedItems.push(city);
        }
      });
    });
  }

  displayRecommendations(matchedItems);
}

function handleClear() {
  const inputEl = document.getElementById("searchInput");
  const resultsContainer = document.getElementById("resultsContainer");

  if (inputEl) {
    inputEl.value = "";
  }
  if (resultsContainer) {
    resultsContainer.innerHTML = "";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("btnSearch");
  const clearBtn = document.getElementById("btnClear");
  const searchInput = document.getElementById("searchInput");

  if (searchBtn) {
    searchBtn.addEventListener("click", handleSearch);
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", handleClear);
  }

  if (searchInput) {
    searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleSearch();
      }
    });
  }
});
