let games = [];

const container = document.getElementById("games");

// Skeleton Loading
container.innerHTML = Array(6).fill(`
  <div class="skeleton"></div>
`).join("");

fetch("data/games.json")
  .then(res => res.json())
  .then(data => {
    games = data;
    render(games);
  });

function render(list) {
  container.innerHTML = "";

  list.forEach(game => {
    container.innerHTML += `
      <div class="card" onclick="openGame('${game.id}')">
        <img src="${game.image}" loading="lazy"/>
        <h3>${game.title}</h3>
      </div>
    `;
  });
}

function openGame(id) {
  window.location.href = "game.html?id=" + id;
}

// Search (instant)
document.getElementById("search").addEventListener("input", (e) => {
  const v = e.target.value.toLowerCase();
  render(games.filter(g => g.title.toLowerCase().includes(v)));
});
