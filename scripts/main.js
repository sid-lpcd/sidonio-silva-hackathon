import { startGame } from "./utils/apiVolleyballStats.js";
import { displayTeams } from "./utils/selectingTeams.js";

const runGame = async () => {
  const startBtn = document.querySelector(".introduction-btn");
  startBtn.disabled = true;
  const teams = await startGame();

  startBtn.disabled = false;

  startBtn.addEventListener("click", () => {
    document.querySelector(".introduction").style.display = "none";
    displayTeams(teams);
  });
};

runGame();
