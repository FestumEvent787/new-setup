const dbService = require("./dbService");

const getCountryDetails = async (cityId) => {
  try {
    let countryData = await dbService.findOneRecord(
      "CountryModel",
      {
        isDeleted: false,
      },
      {
        _id: 1,
        arrCountryJson: 1,
      }
    );

    let countryName = "";
    let stateName = "";
    let cityName = "";
    countryData.arrCountryJson.forEach((country) => {
      country.arrStateList.forEach((state) => {
        state.arrCityList.forEach((city) => {
          if (city?._id == cityId) {
            countryName = country?.vCountryName;
            stateName = state?.vStateName;
            cityName = city?.vCityName;
          }
        });
      });
    });

    return { countryName, stateName, cityName };
  } catch (error) {}
  console.error("getCountryDetailsError ----------->", error);
  throw new Error(error?.message);
};

module.exports = getCountryDetails;
