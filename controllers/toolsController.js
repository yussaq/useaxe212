const express = require('express');
const router = express.Router();
const basePath = process.cwd();
const fs = require("fs");
// Json file
const fileName = `${basePath}/public/asset/json/collections.json`;  
let data = JSON.parse(fs.readFileSync(fileName));

const getTools = ((req, res) => {
    res.render(`${basePath}/views/pages/tools.ejs`, { 
        title:'Tools',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 
        collect :data 
    });
})

const postGenerate = ((req, res, next) => {
    res.redirect(301,'/');
})

const postReset = ((req, res, next) => {
    var attributeJson    = `${basePath}/public/asset/json/attributes.json`;
    var settingJson      = `${basePath}/public/asset/json/setting.json`;    
    var collectionJson   = `${basePath}/public/asset/json/collections.json`;            
    const dirattributes  = `${basePath}/public/asset/attributes/`
    const dircollections = `${basePath}/public/asset/collections/`    

    const newdata = { 
        id: 1,
        name: 'my collection',
        description : 'my best collection',
        quantity : 100,
        ipfs : 'https://',
        creator: 'Yussaq NF',
        attributes : ''
    };

    var datasetting = [];
    datasetting.push(newdata);
    fs.writeFile(settingJson, JSON.stringify(datasetting), (err) => {
        if (err)
        console.log(err);
    });  

    var datacollections = [];
    //datacollections.push({});
    fs.writeFile(attributeJson, JSON.stringify(datacollections), (err) => {
        if (err)
        console.log(err);
    });  

    try {
        fs.statSync(`${basePath}/public/asset/attributes`);
        console.log('file or directory exists');
        fs.rmdir(dirattributes, { recursive: true }, (err) => {
            if (err) {
                throw err;
            }    
            console.log(`${dirattributes} is deleted!`);
        });
    }
       catch (err) {
        if (err.code === 'ENOENT') {
        console.log('file or directory does not exist');
        }
       }

       try {
        fs.statSync(`${basePath}/public/asset/collections`);
        console.log('file or directory exists');
        fs.rmdir(dircollections, { recursive: true }, (err) => {
            if (err) {
                throw err;
            }    
            console.log(`${dircollections} is deleted!`);
        });
    }
       catch (err) {
        if (err.code === 'ENOENT') {
        console.log('file or directory does not exist');
        }
       }       
/* 
    if (fs.existsSync(`${basePath}/public/asset/attributes`)) {    
        fs.rmdir(dirattributes, { recursive: true }, (err) => {
            if (err) {
                throw err;
            }    
            console.log(`${dirattributes} is deleted!`);
        });
    }
    
    if (fs.existsSync(`${basePath}/public/asset/collections/`)) {        
    fs.rmdir(dircollections, { recursive: true }, (err) => {
        if (err) {
            throw err;
        }    
        console.log(`${dircollections} is deleted!`);
    });
    }
  */
    if (!fs.existsSync(`${basePath}/public/asset/attributes`)) {
        fs.mkdirSync(`${basePath}/public/asset/attributes`);
    }
    if (!fs.existsSync(`${basePath}/public/asset/collections`)) {
        fs.mkdirSync(`${basePath}/public/asset/collections`);
    }        
    res.redirect(301,'/setting');
})

module.exports = {
    getTools,
    postGenerate,
    postReset
}