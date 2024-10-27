import { createElement } from "./helpers.js";

let currentRound = 0;
let totalRounds = 0;
let results = [];
let rankings = [];
let startingStats = {};
// const createMatches = (teams) => {
//   const matches = [];
//   for (let i = 0; i < teams.length; i++) {
//     for (let j = i + 1; j < teams.length; j++) {
//       matches.push([teams[i], teams[j]]);
//     }
//   }
//   return matches;
// };

const createMatches = (teams) => {
  const matches = [];
  let round = [];
  const teamCount = teams.length;

  for (let i = 0; i < teamCount - 1; i++) {
    for (let j = 0; j < teamCount / 2; j++) {
      // Match teams in pairs for each round
      const team1 = teams[j];
      const team2 = teams[teamCount - 1 - j];

      round.push([team1, team2]);

      // Every 3 matches (one round), add round to matches and start a new one
      if (round.length === 3) {
        matches.push(round);
        round = [];
      }
    }

    // Rotate teams for the next round
    teams.splice(1, 0, teams.pop());
  }

  return matches;
};

const displayRanking = (parent) => {
  parent.innerHTML = "";

  rankings.sort((a, b) => b.league.wins - a.league.wins);

  rankings.forEach((team, index) => {
    createElement(
      "game-league__rank",
      "li",
      `${index + 1}   ${team.name}   W: ${team.league.wins}   L: ${
        team.league.losses
      }`,
      parent
    );
  });
};

const determineRank = (userTeam) => {
  const rank = rankings.findIndex((team) => team.id === userTeam.id) + 1;

  const userContainer = document.querySelector(".game-final__user-rank");

  const userLogo = createElement("winner__img", "img", null, userContainer);
  userLogo.src = userTeam.logo;
  userLogo.alt = `${userTeam.name} Logo`;

  createElement(
    "winner__name",
    "h3",
    `Congratulations, you ranked ${rank} on the League!`,
    userContainer
  );

  createElement(
    "winner__text",
    "p",
    `Congratulations to ${userTeam.name} for an amazing performance throughout the league. Maybe next time you can win the league!!`,
    userContainer
  );
};

const announceWinner = (winner, userWon) => {
  const name = userWon
    ? `Congratulations, you won the League!`
    : `${winner.name} Wins the League!`;
  const winnerContainer = document.querySelector(".game-final__winner");

  const winnerLogo = createElement("winner__img", "img", null, winnerContainer);
  winnerLogo.src = winner.logo;
  winnerLogo.alt = `${winner.name} Logo`;

  createElement("winner__name", "h3", name, winnerContainer);

  createElement(
    "winner__text",
    "p",
    `Congratulations to ${winner.name} for an amazing performance throughout the league. Well-deserved champions!`,
    winnerContainer
  );
};

const playNextRound = (matches, userTeam) => {
  const resultsList = document.querySelectorAll(".game-league__results");
  if (currentRound < totalRounds) {
    results[currentRound] = [];

    const roundMatches = matches[currentRound];

    roundMatches.forEach(([teamA, teamB]) => {
      const result = teamA.playMatch(teamB);
      let winner = null;
      let loser = null;
      if (!result) {
        winner = teamB;
        loser = teamA;
        teamB.league.wins++;
        teamA.league.losses++;
      } else {
        winner = teamA;
        loser = teamB;
        teamA.league.wins++;
        teamB.league.losses++;
      }

      // Store match result
      results[currentRound].push({
        match: `${teamA.name} vs ${teamB.name}`,
        winner: winner.name,
        loser: loser.name,
      });
    });

    results[currentRound].forEach((result) => {
      createElement(
        "game-league__game",
        "li",
        `${result.match} - Winner: ${result.winner}, Loser: ${result.loser}`,
        resultsList[1]
      );
    });

    displayRanking(document.querySelector(".game-league__results"));
    currentRound++; // Move to the next round
  } else {
    if (rankings[0].id == userTeam.id) {
      announceWinner(rankings[0], true);
      document.querySelector(".game-final__user-rank").style.display = "none";
    } else {
      determineRank(userTeam);
      announceWinner(rankings[0], false);
    }

    displayRanking(document.querySelector(".game-final__results"));

    document.querySelectorAll(".game-league__results")[1].innerHTML = "";

    document.querySelector(".game-league").style.display = "none";
    document.querySelector(".game-final").style.display = "block";
  }
};

const renderTeamStatsCard = (oldTeamStats, userTeam, stats) => {
  const teamStatsContainer = document.querySelector(".game-league__team-stats");
  teamStatsContainer.innerHTML = ""; // Clear previous stats

  const statsCard = createElement(
    "team-stats__card",
    "div",
    null,
    teamStatsContainer
  );

  const logoElement = createElement("team-stats__logo", "img", null, statsCard);
  logoElement.src = userTeam.logo;
  logoElement.alt = `${userTeam.name} logo`;

  createElement(
    "team-stats__name",
    "h3",
    `${userTeam.name} - Team Stats`,
    statsCard
  );

  const currentPower = userTeam.calculateTeamPower();
  const powerChange = currentPower - oldTeamStats.teamPower;

  const powerChangeColor =
    powerChange > 0 ? "green" : powerChange < 0 ? "red" : "grey";

  const powerElement = createElement(
    "team-stats__power",
    "h2",
    `${currentPower.toFixed(2)} ${
      powerChange !== 0
        ? `(${powerChange > 0 ? "+" : "-"}${powerChange.toFixed(2)})`
        : ""
    }`,
    statsCard
  );
  powerElement.style.color = powerChangeColor;

  stats.forEach((stat) => {
    const statContainer = createElement(
      "team-stats__container",
      "div",
      null,
      statsCard
    );

    const currentStatValue = userTeam.teamStats[stat];
    const change = currentStatValue - oldTeamStats.teamStats[stat];

    createElement(
      "team-stats__stat-label",
      "span",
      `${stat}: ${currentStatValue}`,
      statContainer
    );

    // Progress Bar
    const progressBar = createElement(
      "team-stats__progress-bar",
      "div",
      null,
      statContainer
    );

    const progress = createElement(
      "team-stats__progress",
      "div",
      null,
      progressBar
    );
    progress.style.width = `${currentStatValue}%`;

    const changeDisplay = createElement(
      "team-stats__change",
      "span",
      change !== 0 ? `${change > 0 ? "+" : "-"}${change}` : "+ 0",
      statContainer
    );

    change > 0
      ? changeDisplay.classList.add("team-stats__change--increase")
      : change < 0
      ? changeDisplay.classList.add("team-stats__change--decrease")
      : null;
  });
};

const resetGame = (userTeam, otherTeams, matches) => {
  // Reset game variables
  currentRound = 0;
  results = [];
  matches = [];
  rankings = [];
  totalRounds = 0;

  // Reset team statistics (if you have a userTeam or array of teams)
  userTeam.teamStats = startingStats.teamStats; // Assuming a resetStats method exists
  otherTeams.forEach((team) => {
    team = {};
  }); // Reset all teams if applicable
};

const handleImprovementSubmit = (event, userTeam, otherTeams) => {
  event.preventDefault();
  const oldTeamStats = userTeam.getOldStats();
  userTeam.improveStat(
    event.target.improvementType.value.toLowerCase(),
    parseInt(event.target.improvementRange.value)
  );

  const keys = Object.keys(userTeam.teamStats);

  otherTeams.forEach((team) => {
    team.improveStat(
      keys[Math.floor(keys.length * Math.random())],
      Math.floor((Math.random() - 0.4) * 5)
    );
  });

  renderTeamStatsCard(oldTeamStats, userTeam, keys);

  document.querySelector(".improvements").reset();

  document.querySelector(".improvements").style.display = "none";
};

export const runLeague = (userTeam, otherTeams) => {
  startingStats = userTeam.getOldStats();
  console.log(startingStats);

  rankings = [userTeam, ...otherTeams];

  rankings.forEach((team) => {
    team.league = {
      wins: 0,
      losses: 0,
    };
  });

  const matches = createMatches(rankings);

  totalRounds = matches.length;
  playNextRound(matches, userTeam);

  renderTeamStatsCard(
    userTeam.getOldStats(),
    userTeam,
    Object.keys(userTeam.teamStats)
  );

  document.querySelector(".game-teams").style.display = "none";
  document.querySelector(".game-league").style.display = "block";
  let btn = document.querySelector(".game-league__next-btn");
  if (!btn.dataset.listenerAdded) {
    // Check if listener already added
    btn.dataset.listenerAdded = "true"; // Mark as listener added
    btn.addEventListener("click", () => {
      playNextRound(matches, userTeam);

      const teamStatsContainer = document.querySelector(
        ".game-league__team-stats"
      );

      teamStatsContainer
        .querySelectorAll(".team-stats__container")
        .forEach((statContainer, index) => {
          const changeDisplay = statContainer.querySelector(
            ".team-stats__change"
          );
          changeDisplay.textContent = "0";
          changeDisplay.classList.remove(
            "team-stats__change--increase",
            "team-stats__change--decrease"
          );
        });

      const powerDisplay =
        teamStatsContainer.querySelector(".team-stats__power");
      powerDisplay.style.color = ""; // Reset color

      let show = document.querySelector(".improvements__slider-value");
      show.innerText = "0";
      document.querySelector(".improvements").style.display = "unset";
    });
  }

  const improvementsSlider = document.querySelectorAll(".improvements__slider");
  if (!improvementsSlider[0].dataset.listenerAdded) {
    // Check if listener already added
    improvementsSlider[0].dataset.listenerAdded = "true"; // Mark as listener added

    improvementsSlider[0].addEventListener("change", (event) => {
      let show = document.querySelector(".improvements__slider-value");
      show.innerText = event.target.value;
    });
  }

  const improvementSelector = document.querySelector(".improvements__selector");
  Object.keys(userTeam.teamStats).forEach((skill) => {
    createElement(
      "improvement",
      "option",
      skill.toUpperCase(),
      improvementSelector
    );
  });

  btn = document.querySelector(".improvements");
  if (!btn.dataset.listenerAdded) {
    // Check if listener already added
    btn.dataset.listenerAdded = "true"; // Mark as listener added
    btn.addEventListener("submit", (event) => {
      handleImprovementSubmit(event, userTeam, otherTeams);
    });
  }

  btn = document.querySelector(".game-final__reset-btn");
  if (!btn.dataset.listenerAdded) {
    // Check if listener already added
    btn.dataset.listenerAdded = "true"; // Mark as listener added
    btn.addEventListener("click", (event) => {
      resetGame(userTeam, otherTeams, matches);
      document.querySelector(".game-final__user-rank").innerHTML = "";
      document.querySelector(".game-final__winner").innerHTML = "";
      document.querySelector(".game-final__results").innerHTML = "";
      document.querySelector(".introduction").style.display = "unset";
      document.querySelector(".game-final").style.display = "none";
    });
  }
};
