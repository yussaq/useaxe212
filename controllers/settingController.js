const express = require('express');
const router = express.Router();
const basePath = process.cwd();
const fs = require("fs");

//let data = JSON.parse(fs.readFileSync(fileName, 'utf8'));


var readJson = (fileName, cb) => {
    fs.readFile(require.resolve(fileName), (err, data) => {
      if (err)
        cb(err)
      else
        cb(null, JSON.parse(data))
    })
  }
    
const getSetting = ((req, res, next) => {
    var fileName = `${basePath}/public/asset/json/setting.json`;    
    var data = JSON.parse(fs.readFileSync(fileName, 'utf8'));
    if (data === undefined || data.length == 0) {
        const newdata = [{ 
            id: 1,
            name: 'my collection',
            description : 'my best collection',
            quantity : 10,
            ipfs : 'https://',
            creator: 'Yussaq NF',
            attributes : 'background'
        }];
        data=newdata; 
    }
    res.render(`${basePath}/views/pages/setting.ejs`, {
        title:'Setting',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 
        setting :data[0]
    });
});

const updateSetting = ((req, res, next) => {
    var fileName = `${basePath}/public/asset/json/setting.json`;    
    var newdata = { 
        id: req.body.id,
        name: req.body.name,
        description : req.body.description,
        quantity : req.body.quantity,
        ipfs :req.body.ipfs,
        creator: req.body.creator,
        attributes : req.body.attributes
    };
  
    var formdata = req.body;    
    var datasetting = [];
    datasetting.push(newdata);
    fs.writeFile(fileName, JSON.stringify(datasetting), (err) => {
        if (err)
        console.log(err);
    });            

    tabArray = req.body.attributes.split(',');

    if (!fs.existsSync(`${basePath}/public/asset/attributes`)) {
        fs.mkdirSync(`${basePath}/public/asset/attributes`);
    }
    if (!fs.existsSync(`${basePath}/public/asset/collections`)) {
        fs.mkdirSync(`${basePath}/public/asset/collections`);
    }  
        
    tabArray.forEach((item,index)  => {        
        if (!fs.existsSync(`${basePath}/public/asset/attributes/${item}`)) {
            fs.mkdirSync(`${basePath}/public/asset/attributes/${item}`);
        }
    });    
    res.redirect(301,'/attributes');
})

module.exports = {
    getSetting,
    updateSetting
}