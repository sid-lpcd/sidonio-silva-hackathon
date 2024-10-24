import { createElement } from "./helpers.js";

let currentRound = 0;
let totalRounds = 0;
const results = [];
let rankings = [];

const createMatches = (teams) => {
  const matches = [];
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      matches.push([teams[i], teams[j]]);
    }
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

  console.log(rank);
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
    const roundMatches = matches.slice(
      currentRound * 3,
      (currentRound + 1) * 3
    );
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

    document.querySelector(".game-league").style.display = "none";
    document.querySelector(".game-final").style.display = "block";
  }
};

export const runLeague = (userTeam, otherTeams) => {
  rankings = [userTeam, ...otherTeams];

  rankings.forEach((team) => {
    team.league = {
      wins: 0,
      losses: 0,
    };
  });

  const matches = createMatches(rankings);

  totalRounds = matches.length / 3; // 3 games rounds per round
  playNextRound(matches, userTeam);

  document.querySelector(".game-teams").style.display = "none";
  document.querySelector(".game-league").style.display = "block";
  document
    .querySelector(".game-league__next-btn")
    .addEventListener("click", () => {
      playNextRound(matches, userTeam);
    });
};
