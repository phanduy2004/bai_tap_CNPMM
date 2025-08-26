// src/config/viewEngine.js
import express from "express"; 
// Nếu dùng ES5: const express = require('express');

const configViewEngine = (app) => {
  // Thiết lập thư mục tĩnh chứa images, css, js...
  app.use(express.static("./src/public"));

  // Thiết lập view engine
  app.set("view engine", "ejs");

  // Thiết lập thư mục chứa views
  app.set("views", "./src/views");
};

export default configViewEngine;
// Nếu dùng ES5: module.exports = configViewEngine;
