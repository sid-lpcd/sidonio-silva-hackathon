import { createElement } from "./helpers.js";

let currentIndex = 0;
const teamsPerPage = 4;
let userTeam = {};
let leagueTeams = [];

const selectLeagueTeams = (selectedTeam, teams) => {
  leagueTeams = [];

  teams.forEach((team) => {
    // Check if the current card is not the selected team card
    if (team !== selectedTeam) {
      leagueTeams.push(team);
    }
  });

  // Randomly select 4 teams from the remaining teams
  leagueTeams = leagueTeams.sort(() => Math.random() - 0.5).slice(0, 4);
  console.log("League teams:", leagueTeams);
};

export const displayTeams = (teams) => {
  document.querySelector(".game-teams").style.display = "unset";

  const teamContainer = document.querySelector(".game-teams__container");
  teamContainer.innerHTML = "";

  const start = currentIndex * teamsPerPage;
  const end = start + teamsPerPage;
  const currentTeams = teams.slice(start, end);

  currentTeams.forEach((team) => {
    const card = createElement("team-card", "div", null, teamContainer);
    card.setAttribute("team-id", team.id);

    card.addEventListener("click", (event) => {
      const teamId = event.target.getAttribute("team-id");

      const selectedTeam = teams.find((team) => team.id.toString() === teamId);
      selectedTeam ? (userTeam = { ...selectedTeam }) : null;

      selectLeagueTeams(selectedTeam); // Pass the selected team object
    });

    const rowTop = createElement("team-card__row", "div", null, card);
    const image = createElement("team-card__img", "img", null, rowTop);
    image.src = team.logo;
    image.alt = team.name;

    createElement("team-card__name", "h3", team.name, rowTop);
    createElement("team-card__stats", "p", `Last 5 Games:`, card);
    createElement(
      "team-card__stats",
      "p",
      `Wins - ${team.wins}, Losses - ${team.losses}`,
      card
    );
    createElement("team-card__stats", "p", "Statistics:", card);
    createElement(
      "team-card__stats",
      "p",
      `Blocks: ${team.teamStats.blocks}`,
      card
    );
    createElement(
      "team-card__stats",
      "p",
      `Aces: ${team.teamStats.aces}`,
      card
    );
    createElement(
      "team-card__stats",
      "p",
      `Hits: ${team.teamStats.hits}`,
      card
    );
    createElement(
      "team-card__stats",
      "p",
      `Saves: ${team.teamStats.saves}`,
      card
    );
    createElement(
      "team-card__stats",
      "p",
      `Tips: ${team.teamStats.tips}`,
      card
    );
  });

  // Event Listeners for buttons
  document
    .querySelector(".game-teams__prev-btn")
    .addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        displayTeams(teams);
      }
    });
  document
    .querySelector(".game-teams__next-btn")
    .addEventListener("click", () => {
      if ((currentIndex + 1) * teamsPerPage < teams.length) {
        currentIndex++;
        displayTeams(teams);
      }
    });

  updateVisibility(teams);
};

const updateVisibility = (teams) => {
  document.querySelector(".game-teams__prev-btn").style.display =
    currentIndex === 0 ? "none" : "inline";
  document.querySelector(".game-teams__next-btn").style.display =
    (currentIndex + 1) * teamsPerPage >= teams.length ? "none" : "inline";
};
