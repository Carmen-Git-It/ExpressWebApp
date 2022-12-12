/*********************************************************************************
*  WEB322 – Assignment 6
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Carmen Whitton Student ID: 102710217 Date: 12/10/2022
*
*  Online (Heroku) URL: https://web322-carmen.herokuapp.com/
*
********************************************************************************/

// Sequelize config
const Sequelize = require('sequelize');
const sequelize = new Sequelize('d1qsngvf6mg3lb', 'mdkaivmqngmdpo', 'f9f3058d0910434bc6e8d49f0bf9cb2fba475516f326a9944e16b6a64587384f', {
  host: 'ec2-52-71-23-11.compute-1.amazonaws.com',
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
    ssl:{rejectUnauthorized: false}
  },
  query: {raw:true}
});

// Data Models
const Post = sequelize.define('Post', {
  body: Sequelize.TEXT,
  title: Sequelize.STRING,
  postDate: Sequelize.DATE,
  featureImage: Sequelize.STRING,
  published: Sequelize.BOOLEAN
});

const Category = sequelize.define('Category', {
  category: Sequelize.STRING
});

Post.belongsTo(Category, {foreignKey: 'category'});

// Reads and parses the data from the employees.json file into the
// global employees variable. Does the same for departments and
// departments.json
function initialize() {
  return new Promise((resolve, reject) => {
    sequelize.sync().then(() => {
      resolve();
    }).catch((e) => {
      reject("Unable to sync the database: " + e);
    });
  });
}

// Add post
function addPost(post) {
  return new Promise((resolve, reject) => {
    post.published = post.published ? true : false;
    for (key in post) {
      if (post[key] === "") {
        post[key] = null;
      }
    }
    post.postDate = new Date();
    Post.create(post).then(() => {
      resolve();
    }).catch((e) => {
      reject("Post creation failed: " + e);
    });
  });
}

function addCategory(category) {
  console.log("!!!!!!Adding Category!!!!!");
  return new Promise((resolve, reject) => {
    for(key in category) {
      if (category[key] === "") {
        category[key] = null;
      }
    }
    Category.create(category).then(() => {
      resolve();
    }).catch((e) => {
      reject("Error creating category: " + e);
    });
  });
}

function deleteCategoryById(id) {
  return new Promise((resolve, reject) => {
    Category.destroy({
      where: {
        id: id
      }
    }).then(() => {
      resolve();
    }).catch((e) => {
      reject("Error destroying category " + id + ": " + e);
    });
  });
}

function deletePostById(id) {
  return new Promise((resolve, reject) => {
    Post.destroy({
      where: {
        id: id
      }
    }).then(() => {
      resolve();
    }).catch((e) => {
      reject("Error destroying post " + id + ": " + e);
    });
  });
}

// Returns the list of all posts
function getAllPosts() {
  return new Promise((resolve, reject) => {
    Post.findAll().then((data) => {
      resolve(data);
    }).catch((e) => {
      reject("No results retured for getAllPosts: " + e);
    });
  });
}

function getPublishedPosts() {
  return new Promise((resolve, reject) => {
    Post.findAll({
      where: {
        published: true
      }
    }).then((data) => {
      resolve(data);
    }).catch((e) => {
      reject("No results returned for getPublishedPosts: " + e);
    });
  });
}

// Returns the list of all categories
function getCategories() {
  return new Promise((resolve, reject) => {
    Category.findAll().then((data) => {
      resolve(data);
    }).catch((e) => {
      reject("No results returned for getCategories: " + e);
    });
  });
}

function getPostsByCategory(category) {
  return new Promise((resolve, reject) => {
    Post.findAll({
      where: {
        category: category
      }
    }).then((data) => {
      resolve(data);
    }).catch((e) => {
      reject("No results returned for getPostsByCategory " + category + ": " + e);
    });
  });
}

function getPostsByMinDate(minDateStr) {
  return new Promise((resolve, reject) => {
    const {gte} = Sequelize.Op;
    Post.findAll({
      where: {
        postDate: {
          [gte] : new Date(minDateStr)
        }
      }
    }).then((data) => {
      resolve(data);
    }).catch((e) => {
      reject("No results returned for getPostsByMinDate " + minDateStr + ": " + e);
    });
  });
}

function getPostById(id) {
  return new Promise((resolve, reject) => {
    Post.findAll({
      where: {
        id: id
      }
    }).then((data) => {
      resolve(data[0]);
    }).catch((e) => {
      reject("No results returned for getPostById " + id + ": " + e);
    });
  });
}

function getPublishedPostsByCategory(category) {
  return new Promise((resolve, reject) => {
    Post.findAll({
      where: {
        published: true,
        category: category
      }
    }).then((data) => {
      resolve(data);
    }).catch((e) => {
      reject("No results returned for getPublishedPostsByCategory: " + e);
    });
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
  deleteCategoryById,
  deletePostById,
  addCategory
}
