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
const data = require(path.join(__dirname, 'data-service.js'));

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
  data.getAllEmployees()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log("Error retrieving employees: " + err);
      res.json({ message: err });
    });
});

// Route to manager data
app.get("/managers", (req, res) => {
  data.getManagers()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log("Error retrieving managers: " + err);
      res.json({ message: err });
    });
});

// Route to department data
app.get("/departments", (req, res) => {
  data.getDepartments()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log("Error retrieving departments: " + err);
      res.json({ message: err });
    });
});

// Catch all other requests
app.use((req, res) => {
  res.status(404).send("Page Not Found");
})

data.initialize().then(() => {
  app.listen(HTTP_PORT);
  console.log("Express http server listening on " + HTTP_PORT);
}).catch((err) => {
  console.log("Error starting server: " + err + " aborting startup");
});

