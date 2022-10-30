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
const fs = require('fs');
const path = require('path');

// Representation of the JSON data
let posts = [];
let categories = [];

// Reads and parses the data from the employees.json file into the
// global employees variable. Does the same for departments and
// departments.json
function initialize() {
  return new Promise((resolve, reject) => {
    try {
      fs.readFile(path.join(__dirname, '/data/posts.json'), 'utf-8', (err, data) => {
        if (err) {
          console.log(err);
          throw err;
        }

        posts = JSON.parse(data);
      });

      fs.readFile(path.join(__dirname, '/data/categories.json'), 'utf-8', (err, data) => {
        if (err) {
          console.log(err);
          throw err;
        }

        categories = JSON.parse(data);
      });
    } catch (ex) {
      console.log("Error encountered in file reading.");
      reject("Error encountered in file reading.");
    }
    resolve();
  });
}

// Add post
function addPost(post) {
  return new Promise((resolve, reject) => {
    if (post.hasOwnProperty('published')) {
      post.published = true;
    } else {
      posts.published = false;
    }
    post.id = posts.length + 1;
    date = new Date();
    post.postDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    posts.push(post);

    if (post) {
      resolve(post);
    } else {
      reject("Error adding post! " + post);
    }
  });
}

// Returns the list of all posts
function getAllPosts() {
  return new Promise((resolve, reject) => {
    if (posts.length === 0) {
      reject("No posts found!");
    } else {
      resolve(posts.filter(() => { return true; }));
    }
  });
}

function getPublishedPosts() {
  return new Promise((resolve, reject) => {
    if (posts.length === 0) {
      reject("No posts found");
    }
    else {
      resolve(posts.filter((post) => {
        return post.published === true;
      }));
    }
  });
}

// Returns the list of all categories
function getCategories() {
  return new Promise((resolve, reject) => {
    if (categories.length === 0) {
      reject("No results found");
    } else {
      resolve(categories.filter(() => { return true; }));
    }
  });
}

function getPostsByCategory(category) {
  return new Promise((resolve, reject) => {
    let temp = posts.filter((post) => {
      return post.category === category;
    });
    if (temp.length === 0) {
      reject("No results returned");
    } else {
      resolve(temp);
    }
  });
}

function getPostsByMinDate(minDateStr) {
  return new Promise((resolve, reject) => {
    let temp = posts.filter((post) => {
      return (new Date(post.postDate) >= new Date(minDateStr));
    });
    if (temp.length === 0) {
      reject("No results returned");
    } else {
      resolve(temp);
    }
  });
}

function getPostById(id) {
  return new Promise((resolve, reject) => {
    let temp = posts.filter((post) => {
      return post.id === id;
    });
    if (temp.lenth === 0) {
      reject("No result returned");
    } else {
      resolve(temp[0]);
    }
  });
}

function getPublishedPostsByCategory(category) {
return new Promise((resolve, reject) => {
  let temp = posts.filter((post) => {
    return post.published === true && post.category === category;
  });
  if (temp.length === 0) {
    reject("No results returned");
  } else {
    resolve(temp);
  }
});
}

module.exports = {
  initialize,
  getAllPosts,
  getCategories,
  getPublishedPosts,
  addPost,
  getPostsByCategory,
  getPostsByMinDate,
  getPostById,
  getPublishedPostsByCategory,
}
