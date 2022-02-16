const express = require('express');
const router = express.Router();
const basePath = process.cwd();
const fs = require("fs");
// Json file
const fileName = `${basePath}/public/asset/json/collections.json`;  
let data = JSON.parse(fs.readFileSync(fileName));

const getHome = ((req, res) => {
    res.render(`${basePath}/views/pages/home.ejs`, { 
        title:'Home',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 
        collect :data 
    });
})
const getHomepage = ((req, res) => {
    res.render(`${basePath}/views/pages/home.ejs`, { 
        title:'Home',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 
        collect :data 
    });
})

module.exports = {
    getHome,
    getHomepage
}