/*################################################################################################*\
#                                                                                                  #
#     .01   10.        .0101010.        .0110110.        .0010010.  100         011  .0101010.     #
#   1010     0101    0101010101000    0100101101100    1010010010100  010     110  0101001010100   #
#  0100       0101  1010             0110       0010             0110  010   010  0110       0010  #
# 010           000101011001101010000101000100101101001001001001010010  0011100  01101001010100010 #
#  1000       0010             0110  0010             0010       0110  010   000  0110             #
#   0010101010100    0110100010100    0110101010110    0110100101010  011     101  0110111010000   #
#     '0101010'        '0100100'        '0100100'        '1001010'  010         010  '0110100'     #
#                                                                                                  #
\*################################################################################################*/

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
    var fileName = `${basePath}/public/asset/json/_setting.json`;    
    var data = JSON.parse(fs.readFileSync(fileName, 'utf8'));
    if (data === undefined || data.length == 0) {
        const newdata = [{ 
            id: 1,
            name: 'my collection',
            initial: 'mc',
            description : 'my collection',
            quantity : 10,
            ipfs : 'https://',
            creator: 'Yussaq NF',
            attributes : 'background',
            ffmpeg : '/usr/bin/ffmpeg' // "c:\\ffmpeg\\bin\\ffmpeg.exe" //linux-> /usr/bin/ffmpeg
        }];
        data=newdata; 
    }
    res.render(`${basePath}/views/pages/setting.ejs`, {
        title:'Setting',
        description: 'Component settings to create nft collections', 
        setting :data[0]
    });
});

const updateSetting = ((req, res, next) => {
    var fileName = `${basePath}/public/asset/json/_setting.json`;    
    var newdata = { 
        id: req.body.id,
        name: req.body.name,
        initial: req.body.initial,
        description : req.body.description,
        quantity : req.body.quantity,
        ipfs :req.body.ipfs,
        creator: req.body.creator,
        attributes : req.body.attributes,
        ffmpeg : req.body.ffmpeg
    };
  
    var formdata = req.body;    
    var datasetting = [];
    datasetting.push(newdata);
    fs.writeFile(fileName, JSON.stringify(datasetting,null,2), (err) => {
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