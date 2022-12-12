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
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    "userName" : {
        type: String,
        unique : true
    },
    "password" : String,
    "email" : String,
    "loginHistory" : [{
        "dateTime" : Date,
        "userAgent" : String
    }]
});

let User; // to be defined on new connection (see initialize)

// Initializes the connection to the MongoDB database
function initialize() {
    return new Promise((resolve, reject) => {
        let db = mongoose.createConnection("mongodb+srv://carmen-git-it:if85synfQ5idRrS@cluster0.uiian.mongodb.net/?retryWrites=true&w=majority");

        db.on('error', (err)=>{
            reject(err); // reject the promise with the provided error
        });
        db.once('open', ()=>{
           User = db.model("users", userSchema);
           resolve();
        });
    });
}

// Registers a new user in the db
function registerUser(userData) {
    return new Promise((resolve, reject) => {
        if (userData.password !== userData.password2) {
            reject("Error: Passwords do not match!");
        } else {
            let newUser = new User(userData);
            newUser.save().then(() => {
                resolve(newUser);
            }).catch((err) => {
                if (err.code === 11000) {
                    reject("User Name already taken");
                } else {
                    reject("There was an error creating the user: " + err);
                }
            });
        }
    });
}

function checkUser(userData) {
    return new Promise((resolve, reject) => {
        User.find({userName : userData.userName})
        .exec()
        .then((users) => {
            if (users.length !== 0) {
                reject("Unable to find user: " + userData.userName);
            } else if (users[0].password !== userData.password) {
                reject("Incorrect Password for user: " + userData.userName);
            } else if (users[0].password === userData.password) {
                users[0].loginHistory.push({dateTime: (new Date()).toString(), userAgent: userData.userAgent});
                User.updateOne({userName : users[0].userName},
                    {$set: {loginHistory : users[0].loginHistory}}).then(() => {
                        resolve(users[0]);
                    }).catch((err) => {
                        reject("There was an error verifying the user:" + err);
                    });
            }
        }).catch((err) => {
            reject("There was an error verifying the user: " + userData.userName);
        }); 
    });
}

module.exports = {
    initialize,
    registerUser,
    checkUser,
}