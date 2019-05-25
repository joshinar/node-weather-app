const path = require("path");
const express = require("express");
const hbs = require("hbs");
const forecast = require("./utils/forecast");
const geocode = require("./utils/geocode");

const app = express();
const port = process.env.PORT || 3000;

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// set up handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// set up static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "weather",
    name: "Naren"
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "about me",
    name: "naren"
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    message: "I am always there to help you",
    title: "Help",
    name: "naren"
  });
});
app.get("/weather", (req, res) => {
  if (!req.query.address) {
    res.send({
      error: "please provide an address"
    });
  } else {
    geocode(
      req.query.address,
      (error, { latitude, longitude, location } = {}) => {
        if (error) {
          return res.send({
            error
          });
        }
        forecast(latitude, longitude, (error, data) => {
          if (error) {
            res.send({ error });
          }
          res.send({
            forecast: data.perc,
            temp: data.temp,
            address: req.query.address,
            location
          });
        });
      }
    );
  }
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "Add a search term"
    });
  }
  console.log(req.query.search);
  res.send({
    products: []
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    errorMsg: "Help article not found"
  });
});
app.get("*", (req, res) => {
  res.render("404", {
    errorMsg: "404, page not found"
  });
});
app.listen(port, () => {
  console.log("Server is up and running on " + port);
});
