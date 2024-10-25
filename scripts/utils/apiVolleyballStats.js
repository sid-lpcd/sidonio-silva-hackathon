import { TeamVolleyball } from "./volleyballTeam.js";

const URL = "https://volleyball-highlights-api.p.rapidapi.com/";
const HEADER = {
  "x-rapidapi-key": "7af93b632bmshfe64ee0cc56df50p158e4fjsncfcfb2f14f34",
  "x-rapidapi-host": "volleyball-highlights-api.p.rapidapi.com",
};

const getLastYearDate = () => {
  const currentDate = new Date();
  const lastYearDate = new Date();

  lastYearDate.setFullYear(currentDate.getFullYear() - 1);

  return lastYearDate.toISOString().split("T")[0];
};

const LAST_YEAR = getLastYearDate();

const volleyballCountryTeams = [
  "Brazil",
  "United States",
  "Poland",
  "Italy",
  "France",
  "Serbia",
  "Argentina",
  "Japan",
  "Iran",
  "Portugal",
  "Canada",
  "Netherlands",
  "Germany",
  "Cuba",
  "China",
  "Turkey",
  "Slovenia",
  "South Korea",
  "Belgium",
  "Bulgaria",
];

const getTeamListId = async (name) => {
  try {
    const response = await axios.get(URL + "teams", {
      headers: HEADER,
      params: {
        name: name,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const getTeamStats = async (id) => {
  try {
    const response = await axios.get(URL + "teams/statistics/" + id, {
      headers: HEADER,
      params: {
        fromDate: LAST_YEAR,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const delay = (delay) => {
  return new Promise((resolve) => setTimeout(resolve, delay));
};

const fetchInfo = async (seasonTeams) => {
  for (let i = 0; i < volleyballCountryTeams.length; i++) {
    const team = volleyballCountryTeams[i];

    const teamData = await getTeamListId(team);
    seasonTeams.push(teamData.data);

    localStorage.setItem("seasonTeams", JSON.stringify(seasonTeams));

    // Delay for 125 ms (8 requests per second)
    await delay(125);
  }

  for (let i = seasonTeams.length - 1; i >= 0; i--) {
    //reverse so that if I remove an element, it won't skip stats of next team
    if (seasonTeams[i].length) {
      seasonTeams[i][0].teamStats = await getTeamStats(seasonTeams[i][0].id);
    } else {
      seasonTeams.splice(i, 1);
    }

    //update localstorage
    localStorage.setItem("seasonTeams", JSON.stringify(seasonTeams));

    // Delay for 125 ms (8 requests per second)
    await delay(125);
  }
  return seasonTeams;
};

export const startGame = async () => {
  // Retrieve the Teams from storage
  let seasonTeams = JSON.parse(localStorage.getItem("seasonTeams")) || [];

  if (!seasonTeams.length) {
    seasonTeams = await fetchInfo(seasonTeams);
  }

  let gameTeams = [];

  seasonTeams.forEach((element) => {
    element.map((team) => {
      const { id, name, logo, teamStats } = team;

      gameTeams.push(new TeamVolleyball(id, name, logo, teamStats));
    });
  });

  return gameTeams;
};
