/*********************************************************************************
*  WEB322 – Assignment 3
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Carmen Whitton Student ID: 102710217 Date: 09/26/2022
*
*  Online (Heroku) URL: https://web322-carmen.herokuapp.com/
*
********************************************************************************/
// Set up required variables
const HTTP_PORT = process.env.PORT || 8080;
const express = require('express');
const app = express();
const path = require('path');
const data = require(path.join(__dirname, 'data-service.js'));
const multer = require("multer");
const cloudinary = require("cloudinary");
const streamifier = require("streamifier");

// Cloudinary config
cloudinary.config({
  cloud_name: 'dg3xex9j4',
  api_key: '677615869349739',
  api_secret: 'cfQP6mnHGiw5SZhwbb9uxzlCG7k',
  secure: true
});

const upload = multer(); // no local storage

app.use(express.static('public'));  // Set public as a resource for static files

// Route to the home page
app.get("/", (req, res) => {
  res.redirect("/about");
});

// Route to About page
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, '/views/about.html'));
});

// Route to blog page (filter posts by published) 
app.get("/blog", (req, res) => {
  data.getPublishedPosts()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log("Error loading blog posts: " + err);
      res.json({ message: err });
    });
});

// Route to employee data
app.get("/posts", (req, res) => {
  data.getAllPosts()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log("Error retrieving posts: " + err);
      res.json({ message: err });
    });
});

// Route to manager data
app.get("/categories", (req, res) => {
  data.getCategories()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log("Error retrieving categories: " + err);
      res.json({ message: err });
    });
});

// Redirects to the add post page
app.get("/posts/add", (req, res) => {
  res.sendFile(path.join(__dirname, '/views/addPost.html'));
});

// Adds posts and uploads files 
app.post("/posts/add", upload.single("featureImage"), (req, res) => {
  let streamUpload = (req) => {
    return new Promise((resolve, reject) => {
      let stream = cloudinary.uploader.upload_stream(
        (result, error) => { // Swapped error and result
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };

  async function upload(req) {
    let result = await streamUpload(req);//.catch((err) => {
    // console.log("Error: " + err);
    // });
    console.log(result);
    return result;
  }

  upload(req).then((uploaded) => {
    req.body.featureImage = uploaded.url;
    data.addPost(JSON.parse(JSON.stringify(req.body)));
    res.redirect("/posts");
  });
});

// Query posts by categories
app.get("/posts?category=value", (req, res) => {

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

