const URL = "https://volleyball-highlights-api.p.rapidapi.com/";
const HEADER = {
  "x-rapidapi-key": "7af93b632bmshfe64ee0cc56df50p158e4fjsncfcfb2f14f34",
  "x-rapidapi-host": "volleyball-highlights-api.p.rapidapi.com",
};

export const getTeamList = async () => {
  // Retrieve the object from storage
  let volleyballList =
    JSON.parse(localStorage.getItem("teamsVolleyball")) || null;
  if (!volleyballList) {
    try {
      const response = await axios.get(URL + "teams", {
        headers: HEADER,
        params: {
          limit: "10",
        },
      });
      volleyballList = response.data;
      // Put the object into storage
      localStorage.setItem("teamsVolleyball", JSON.stringify(volleyballList));
    } catch (error) {
      console.error(error);
    }
  }
  console.log(volleyballList);
  return volleyballList;
};
