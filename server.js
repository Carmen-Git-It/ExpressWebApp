/*********************************************************************************
*  WEB322 – Assignment 3
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Carmen Whitton Student ID: 102710217 Date: 10/26/2022
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
const exphbs = require('express-handlebars');
const stripjs = require('strip-js');

// Handlebars app engine config
app.engine('.hbs', exphbs.engine({
  extname: '.hbs',
  helpers: {
    navLink: function (url, options) {
      return '<li' +
        ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
        '><a href="' + url + '">' + options.fn(this) + '</a></li>';
    },
    equal: function (lvalue, rvalue, options) {
      if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
      if (lvalue != rvalue) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    },
    safeHTML: function (context) {
      return stripjs(context);
    }
  }
}));
app.set('view engine', '.hbs');

// Cloudinary config
cloudinary.config({
  cloud_name: 'dg3xex9j4',
  api_key: '677615869349739',
  api_secret: 'cfQP6mnHGiw5SZhwbb9uxzlCG7k',
  secure: true
});

const upload = multer(); // no local storage

app.use(express.static('public'));  // Set public as a resource for static files

app.use((req, res, next) => {
  let route = req.path.substring(1);
  app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));

  app.locals.viewingCategory = req.query.category;
  next();
});

// Route to the home page
app.get("/", (req, res) => {
  res.redirect("/blog");
});

// Route to About page
app.get("/about", (req, res) => {
  res.render('about');
});

// Route to blog page (filter posts by published) 
app.get("/blog", async (req, res) => {
  // Declare an object to store properties for the view
  let viewData = {};

  // declare empty array to hold "post" objects
  let posts = [];

  // if there's a "category" query, filter the returned posts by category
  if (req.query.category) {
    // Obtain the published "posts" by category
    data.getPublishedPostsByCategory(Number(req.query.category)).then((data) => {
      data.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));
      viewData.posts = data;
      viewData.post = data[0];
    }).catch((err) => {
      viewData.message = "no results";
    });
  } else {
    // Obtain the published "posts"
    data.getPublishedPosts().then((data) => {
      data.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));
      viewData.posts = data;
      viewData.post = data[0];
    }).catch((err) => {
      viewData.message = "no results";
    });
  }

  // sort the published posts by postDate
  posts.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));

  // Obtain the full list of "categories"
  data.getCategories().then((data) => {
    viewData.categories = data;
  }).catch((err) => {
    viewData.categoriesMessage = "no results";
  });

  // render the "blog" view with all of the data (viewData)
  res.render("blog", { data: viewData })

});

// Route to employee data
app.get("/posts", (req, res) => {
  if (req.query.hasOwnProperty('category')) {
    data.getPostsByCategory(Number(req.query.category)).then((data) => {
      res.render('posts', { posts: data });
    }).catch((err) => {
      console.log("Error retrieving posts: " + err);
      res.render("posts", { message: "no results" });
    });
  } else if (req.query.hasOwnProperty('minDate')) {
    data.getPostsByMinDate(req.query.minDate).then((data) => {
      res.render('posts', { posts: data });
    }).catch((err) => {
      console.log("Error retrieving posts: " + err);
      res.render("posts", { message: "no results" });
    });
  } else {
    data.getAllPosts()
      .then((data) => {
        res.render('posts', { posts: data });
      })
      .catch((err) => {
        console.log("Error retrieving posts: " + err);
        res.render("posts", { message: "no results" });
      });
  }
});

// Redirects to the add post page
app.get("/posts/add", (req, res) => {
  res.render('addPost');
});

// Get a post by id
app.get("/posts/:value", (req, res) => {
  data.getPostById(Number(req.params.value)).then((data) => {
    res.json(data);
  }).catch((err) => {
    console.log("Error retrieving post: " + err);
    res.json({ message: err });
  });
});

// Route to manager data
app.get("/categories", (req, res) => {
  data.getCategories()
    .then((data) => {
      res.render("categories", { categories: data });
    })
    .catch((err) => {
      console.log("Error retrieving categories: " + err);
      res.render("categories", { message: "no results" });
    });
});

app.get('/blog/:id', async (req, res) => {

  // Declare an object to store properties for the view
  let viewData = {};

  // declare empty array to hold "post" objects
  let posts = [];

  // if there's a "category" query, filter the returned posts by category
  if (req.query.category) {
    // Obtain the published "posts" by category
    data.getPublishedPostsByCategory(req.query.category).then((data) => {
      posts = data;
    }).catch((err) => {
      viewData.message = "no results";
    });
  } else {
    // Obtain the published "posts"
    data.getPublishedPosts().then((data) => {
      viewData.posts = data;
    }).catch((err) => {
      viewData.message = "no results";
    });
  }

  // sort the published posts by postDate
  posts.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));

  // store the "posts" and "post" data in the viewData object (to be passed to the view)
  viewData.posts = posts;

  // Obtain the post by "id"
  data.getPostById(Number(req.params.id)).then((data) => {
    viewData.post = data;
  }).catch((err) => {
    viewData.message = "no results";
  });

  // Obtain the full list of "categories"
  data.getCategories().then((data) => {
    viewData.categories = data;
  }).catch((err) => {
    viewData.categoriesMessage = "no results";
  });


  // render the "blog" view with all of the data (viewData)
  res.render("blog", { data: viewData })
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

