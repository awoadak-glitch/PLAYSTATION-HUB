let games = [];

const container = document.getElementById("games");

async function loadGames() {
  container.innerHTML = "";

  const res = await fetch("../games/index.json");
  games = await res.json();

  render(games);
}

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

document.getElementById("search").addEventListener("input", (e) => {
  const v = e.target.value.toLowerCase();
  render(games.filter(g => g.title.toLowerCase().includes(v)));
});

loadGames();
