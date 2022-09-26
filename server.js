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

app.use(express.static('public'));  // Set public as a resource for static files

// Set up a route to the home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '/views/home.html')); // Send the home page  
});

// Route to About page
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, '/views/about.html'));
});
// Catch all other requests
app.use((req, res) => {
  res.status(404).send("Page Not Found");
})

app.listen(HTTP_PORT);
console.log("Express http server listening on " + HTTP_PORT);

