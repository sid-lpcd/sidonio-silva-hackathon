export class TeamVolleyball {
  constructor(id, name, logo, stats) {
    this.id = id;
    this.name = name;
    this.logo = logo;
    this.games = this.getTotalGames(stats);
    this.wins = this.findWins(stats);
    this.losses = this.findLosses(stats);
    this.lastFiveGames = this.getLastFiveGames(stats);
    this.teamStats = this.generateTeamStats(this.wins, this.games);
  }

  getTotalGames(stats) {
    const totalGames = stats.reduce((total, season) => {
      return total + season.total.games.played;
    }, 0);
    return totalGames;
  }

  findWins(stats) {
    const totalWins = stats.reduce((total, season) => {
      return total + season.total.games.wins;
    }, 0);
    return totalWins;
  }

  findLosses(stats) {
    const totalLosses = stats.reduce((total, season) => {
      return total + season.total.games.loses;
    }, 0);
    return totalLosses;
  }

  getLastFiveGames(teamStats) {
    const lastGames = [];

    teamStats.forEach((season) => {
      season.total.games.played && lastGames.push(season);
    });

    return lastGames.slice(-5).map((season) => ({
      played: season.total.games.played,
      wins: season.total.games.wins,
      loses: season.total.games.loses,
      pointsScored: season.total.points.scored,
      pointsReceived: season.total.points.received,
    }));
  }

  generateTeamStats(wins, total) {
    return {
      blocks: Math.floor((wins / total) * 85 + Math.floor(Math.random() * 15)),
      aces: Math.floor((wins / total) * 60 + Math.floor(Math.random() * 40)),
      hits: Math.floor((wins / total) * 95 + Math.floor(Math.random() * 5)),
      saves: Math.floor((wins / total) * 80 + Math.floor(Math.random() * 20)),
      tips: Math.floor((wins / total) * 75 + Math.floor(Math.random() * 25)),
    };
  }
  // Method to simulate a match against another team
  playMatch(opponent) {
    let teamPower = this.calculateTeamPower();
    const opponentPower = opponent.calculateTeamPower();

    teamPower -= (Math.random() - 0.5) * 10;

    const matchResult = teamPower > opponentPower ? true : false;

    return matchResult;
  }

  // Calculate total team power based on their stats
  calculateTeamPower() {
    return (
      (this.teamStats.blocks +
        this.teamStats.aces +
        this.teamStats.hits +
        this.teamStats.saves +
        this.teamStats.tips) /
      5
    );
  }

  improveStat(stat, points) {
    if (this.teamStats[stat] !== undefined) {
      this.teamStats[stat] += points;

      // Randomly decrease other stats
      Object.keys(this.teamStats).forEach((otherStat) => {
        if (otherStat !== stat) {
          this.teamStats[otherStat] -= Math.floor((Math.random() - 0.4) * 5);
        }
      });
    }
  }
}
