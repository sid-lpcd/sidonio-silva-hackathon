import { createElement } from "./helpers.js";

let currentRound = 0;
let totalRounds = 0;
let results = [];
let rankings = [];
let startingStats = {};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

const displayRanking = async (parent) => {
  parent.innerHTML = "";
  rankings.sort((a, b) => b.league.wins - a.league.wins);

  parent.scrollIntoView({ behavior: "smooth", block: "center" });

  await Promise.all(
    rankings.map((team, index) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          createElement(
            "game-league__rank",
            "li",
            `${index + 1}   ${team.name}   W: ${team.league.wins}   L: ${
              team.league.losses
            }`,
            parent
          );
          resolve(); // Resolve the promise when the timeout completes
        }, index * 500);
      });
    })
  );
};

const displayMatchResults = async (results, currentRound) => {
  const resultsList = document.querySelectorAll(".game-league__results")[1];

  setTimeout(() => {
    resultsList.scrollIntoView({ behavior: "smooth", block: "end" });
  }, 100);

  await Promise.all(
    results[currentRound].map((match, index) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          createElement(
            "game-league__game",
            "li",
            `${match.match} - Winner: ${match.winner}, Loser: ${match.loser}`,
            resultsList
          );
          resolve(); // Resolve the promise when the timeout completes
        }, index * 500);
      });
    })
  );
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

const playNextRound = async (matches, userTeam) => {
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

    await displayMatchResults(results, currentRound);

    await delay(1000);

    await displayRanking(
      document.querySelector(".game-league__results"),
      currentRound
    );

    await delay(1000);

    await renderTeamStatsCard(
      userTeam.getOldStats(),
      userTeam,
      Object.keys(userTeam.teamStats)
    );
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

const createTeamStatsCard = async (teamStatsContainer, userTeam, stats) => {
  return new Promise((resolve) => {
    const statsCard = createElement(
      "team-stats__card",
      "div",
      null,
      teamStatsContainer
    );

    const logoElement = createElement(
      "team-stats__logo",
      "img",
      null,
      statsCard
    );
    logoElement.src = userTeam.logo;
    logoElement.alt = `${userTeam.name} logo`;

    createElement(
      "team-stats__name",
      "h3",
      `${userTeam.name} - Team Stats`,
      statsCard
    );

    const powerElement = createElement(
      "team-stats__power",
      "h2",
      `0.00`,
      statsCard
    );
    powerElement.style.color = "grey";

    stats.forEach((stat) => {
      const statContainer = createElement(
        "team-stats__container",
        "div",
        null,
        statsCard
      );

      const statLabel = createElement(
        "team-stats__stat-label",
        "span",
        `${stat}: 0`,
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
      progress.style.width = "0%";
      createElement("team-stats__change", "span", "0", statLabel);
    });

    resolve(statsCard); // Resolve the promise after creating the elements
  });
};

const renderTeamStatsCard = async (oldTeamStats, userTeam, stats) => {
  const teamStatsContainer = document.querySelector(".game-league__team-stats");

  let statsCard = teamStatsContainer.querySelector(".team-stats__card");

  if (!statsCard) {
    statsCard = await createTeamStatsCard(teamStatsContainer, userTeam, stats);
  }
  const currentPower = userTeam.calculateTeamPower();
  const powerChange = currentPower - oldTeamStats.teamPower;
  const powerChangeColor =
    powerChange > 0 ? "green" : powerChange < 0 ? "red" : "grey";

  const powerElement = statsCard.querySelector(".team-stats__power");
  powerElement.textContent = `${currentPower.toFixed(2)} ${
    powerChange !== 0
      ? `(${powerChange > 0 ? "+" : "-"}${powerChange.toFixed(2)})`
      : ""
  }`;
  powerElement.style.color = powerChangeColor;

  const statsContainers = document.querySelectorAll(".team-stats__container");

  statsContainers.forEach((stat, index) => {
    const currentStatValue = userTeam.teamStats[stats[index]];
    const statChange = currentStatValue - oldTeamStats.teamStats[stats[index]];
    const statChangeColor =
      statChange > 0 ? "green" : statChange < 0 ? "red" : "black";
    stat.querySelector(
      ".team-stats__progress"
    ).style.width = `${currentStatValue}%`;
    stat.querySelector(".team-stats__stat-label").innerHTML = `${
      stats[index]
    }: ${currentStatValue} <span class="team-stats__change">${
      statChange !== 0 ? `${statChange > 0 ? "+" : ""}${statChange}` : "+0"
    }</span>`;
    const changeDisplay = stat.querySelector(".team-stats__change");

    changeDisplay.style.color = statChangeColor;
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

  document.querySelector(".game-teams").style.display = "none";
  document.querySelector(".game-league").style.display = "block";
  let btn = document.querySelector(".game-league__next-btn");
  if (!btn.dataset.listenerAdded) {
    // Check if listener already added
    btn.dataset.listenerAdded = "true"; // Mark as listener added
    btn.addEventListener("click", () => {
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

      playNextRound(matches, userTeam);
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
