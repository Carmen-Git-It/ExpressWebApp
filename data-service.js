/*********************************************************************************
*  WEB322 – Assignment 2
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Carmen Whitton Student ID: 102710217 Date: 09/26/2022
*
*  Online (Heroku) URL: https://web322-carmen.herokuapp.com/
*
********************************************************************************/
const fs = require('fs');
const path = require('path');

// Representation of the JSON data
let employees = [];
let departments = [];

// Reads and parses the data from the employees.json file into the
// global employees variable. Does the same for departments and
// departments.json
function initialize() {
  return new Promise((resolve, reject) => {
    try {
      fs.readFile(path.join(__dirname, '/data/employees.json'), 'utf-8', (err, data) => {
        if (err) {
          console.log(err);
          throw err;
        }

        employees = JSON.parse(data);
      });

      fs.readFile(path.join(__dirname, '/data/departments.json'), 'utf-8', (err, data) => {
        if (err) {
          console.log(err);
          throw err;
        }

        departments = JSON.parse(data);
      });
    } catch (ex) {
      console.log("Error encountered in file reading.");
      reject("Error encountered in file reading.");
    }
    resolve();
  });
}

// Returns the list of all employees
function getAllEmployees() {
  return new Promise((resolve, reject) => {
    if (employees.length === 0) {
      reject("No employees found!");
    } else {
      resolve(employees.filter(() => { return true; }));
    }
  });
}

// Returns the list of all employees that are also managers
function getManagers() {
  return new Promise((resolve, reject) => {
    const managers = employees.filter((employee) => {
      return employee.isManager === true;
    });
    if (managers.length > 0) {
      resolve(managers);
    } else {
      reject("No results found!");
    }
  });
}

// Returns the list of all departments
function getDepartments() {
  return new Promise((resolve, reject) => {
    if (departments.length === 0) {
      reject("No results found");
    } else {
      resolve(departments.filter(() => { return true; }));
    }
  });
}

module.exports = {
  initialize,
  getAllEmployees,
  getManagers,
  getDepartments
}
