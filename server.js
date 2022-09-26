/*********************************************************************************
*  WEB322 – Assignment 2
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Carmen Whitton Student ID: 102710217 Date: 09/26/2022
*
*  Online (Heroku) URL: TODO TODO TODO
*
********************************************************************************/
// Set up required variables
const HTTP_PORT = process.env.PORT || 8080;
const express = require('express');
const app = express();
const path = require('path');
const dataService = require(path.join(__dirname, "data-service.js"));
const employeeData = require(path.join(__dirname, "/data/employees.json"));
const departmentData = require(path.join(__dirname, "/data/departments.json"));

app.use(express.static('public'));  // Set public as a resource for static files

// Route to the home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '/views/home.html')); // Send the home page  
});

// Route to About page
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, '/views/about.html'));
});

// Route to employee data
app.get("/employees", (req, res) => {
  res.json(employeeData);
});

// Route to manager data
app.get("/managers", (req, res) => {
  //res.json(managerData);
  res.send("TODO: return manager data");
});

// Route to department data
app.get("/departments", (req, res) => {
  res.json(departmentData);
});

// Catch all other requests
app.use((req, res) => {
  res.status(404).send("Page Not Found");
})

app.listen(HTTP_PORT);
console.log("Express http server listening on " + HTTP_PORT);

