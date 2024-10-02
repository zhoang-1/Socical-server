const express = require("express");
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URL = process.env.MONGODB_URL || '';
const PORT = process.env.PORT || 8080;

const configViewEngine = (app) => {
  app.use(express.static("./src/public"));
  app.set("view  engine", "ejs");
  app.set("views", "./src/views");
};

module.exports = {MONGO_URL,PORT,configViewEngine };