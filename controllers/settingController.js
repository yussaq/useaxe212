const express = require('express');
const router = express.Router();
const basePath = process.cwd();
const fs = require("fs");
const fileName = `${basePath}/public/asset/json/setting.json`;  
const data = JSON.parse(fs.readFileSync(fileName));
const getSetting = ((req, res, next) => {
    if (data === undefined || data.length == 0) {
        const newdata = [{ 
            id: 1,
            name: 'my collection',
            description : 'my best collection',
            ipfs :'https://',
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
    const newdata = { 
        id: req.body.id,
        name: req.body.name,
        description : req.body.description,
        ipfs :req.body.ipfs,
        creator: req.body.creator,
        attributes : req.body.attributes
    };
  
    const formdata = req.body;    
    const datasetting = [];
    fs.readFile(fileName, (err, data) => { // get the data from the file
        if (data === undefined || data.length == 0) {
            res.send({msg: 'Setting data updated error'})             
        }
        datasetting.push(newdata);
        fs.writeFile(fileName, JSON.stringify(datasetting), (err) => {
            console.log(err);
        });            
    });
    res.redirect(301,'/attributes');
})
module.exports = {
    getSetting,
    updateSetting
}