const request = require("request");

const forecast = (lat, long, callback) => {
  const url = `https://api.darksky.net/forecast/576e7cbd52640d9afeae9550b28d8bb3/${lat},${long}`;
  request({ url, json: true }, (err, { body }) => {
    err
      ? callback("unable to connect to service", undefined)
      : body.error
      ? callback("Unable to find location", undefined)
      : callback(undefined, {
          temp: `It is currently ${
            body.currently.temperature
          } degrees out there.`,
          perc: `There is a ${
            body.currently.precipProbability
          } % chance of rain.`
        });
  });
};

module.exports = forecast;
