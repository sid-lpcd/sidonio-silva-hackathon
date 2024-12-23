import { createElement } from "./helpers.js";
import { runLeague } from "./volleyballRunLeague.js";

let currentIndex = 0;
const teamsPerPage = 4;
let userTeam = null;
let leagueTeams = [];

const selectLeagueTeams = (selectedTeam, teams) => {
  leagueTeams = [];

  let opponent = null;
  // Randomly select 5 teams from the remaining teams
  while (leagueTeams.length < 5) {
    opponent = teams[Math.floor(Math.random() * teams.length)];
    if (opponent !== selectedTeam && !leagueTeams.includes(opponent)) {
      leagueTeams.push(opponent);
    }
  }
};
const displayTeamCards = (teams) => {
  const teamContainer = document.querySelector(".game-teams__container");
  teamContainer.innerHTML = "";

  const start = currentIndex * teamsPerPage;
  const end = start + teamsPerPage;
  const currentTeams = teams.slice(start, end);

  currentTeams.forEach((team, index) => {
    const card = createElement("team-card", "div", null, teamContainer);
    card.setAttribute("team-id", team.id);
    card.style.animationDelay = `${index * 0.2}s`;

    if (!card.dataset.listenerAdded) {
      // Check if listener already added
      card.dataset.listenerAdded = "true"; // Mark as listener added

      card.addEventListener("click", (event) => {
        const teamId = card.getAttribute("team-id");
        if (document.querySelector(".team-card--selected")) {
          document
            .querySelector(".team-card--selected")
            .classList.remove("team-card--selected");
        }
        card.classList.add("team-card--selected");

        const selectedTeam = teams.find((team) => team.id == teamId);
        selectedTeam ? (userTeam = selectedTeam) : null;

        selectLeagueTeams(selectedTeam, teams); // Pass the selected team object
      });
    }

    const rowTop = createElement("team-card__row", "div", null, card);
    const image = createElement("team-card__img", "img", null, rowTop);
    image.src = team.logo;
    image.alt = team.name;

    createElement("team-card__name", "h3", team.name, rowTop);
    createElement(
      "team-card__stats",
      "p",
      `Wins: ${team.wins}, Losses: ${team.losses}`,
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

  updateVisibility(teams);
};

export const displayTeams = (teams) => {
  document.querySelector(".game-teams").style.display = "unset";

  displayTeamCards(teams);

  let btn = document.querySelector(".game-teams__prev-btn");

  if (!btn.dataset.listenerAdded) {
    // Check if listener already added
    btn.dataset.listenerAdded = "true"; // Mark as listener added
    btn.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        displayTeamCards(teams);
      }
    });
  }

  btn = document.querySelector(".game-teams__next-btn");

  if (!btn.dataset.listenerAdded) {
    // Check if listener already added
    btn.dataset.listenerAdded = "true"; // Mark as listener added
    btn.addEventListener("click", () => {
      if ((currentIndex + 1) * teamsPerPage < teams.length) {
        currentIndex++;
        displayTeamCards(teams);
      }
    });
  }

  btn = document.querySelector(".game-teams__start-btn");

  if (!btn.dataset.listenerAdded) {
    // Check if listener already added
    btn.dataset.listenerAdded = "true"; // Mark as listener added
    btn.addEventListener("click", () => {
      if (userTeam) {
        runLeague(userTeam, leagueTeams);
      }
    });
  }
};

const updateVisibility = (teams) => {
  document.querySelector(".game-teams__prev-btn").style.display =
    currentIndex === 0 ? "none" : "inline";
  document.querySelector(".game-teams__next-btn").style.display =
    (currentIndex + 1) * teamsPerPage >= teams.length ? "none" : "inline";
};
