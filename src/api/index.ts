// fetch data from rapid api

const api =
  "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522%2C151.1957362&radius=1500&type=restaurant&keyword=cruise&key=" +
  process.env.REACT_APP_GOOGLE_API_KEY;

const getPlacesData = async () => {
  try {
    const response = await fetch(api, {
      method: "GET",
      headers: {},
    });
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export default getPlacesData;
