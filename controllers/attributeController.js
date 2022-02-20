const express = require('express');
const router = express.Router();
const basePath = process.cwd();
const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: `${basePath}/public/asset/attributes` })
const fileUpload= require('../middlewares/upload-middleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, `${basePath}/public/asset/attributes`);
  },
  filename: (req, file, cb) => {
      cb(null, Date.now()+'-'+file.originalname);
  }
});

// Json file
const fileAttributes = `${basePath}/public/asset/json/attributes.json`; 
const fileSetting = `${basePath}/public/asset/json/setting.json`;  
const dataAttributes = JSON.parse(fs.readFileSync(fileAttributes));
const dataSetting = JSON.parse(fs.readFileSync(fileSetting));

const tabs = dataSetting[0].attributes;
const getAttribute = ((req, res, next) => {
    const fileAttributes = [];
    const dirAttribute = [];
    const arrayAttribute = [];
/*     
    fs.readdirSync(`${basePath}/public/asset/attributes`).forEach(file => {
        fileAttributes.push(file);
        console.log(file);
        fs.readdirSync(`${basePath}/public/asset/attributes/${file}`).forEach(file => {
            console.log('--'+file);
            fileAttributes.push(file);
        });
        fileAttributes.push(file);
    });
 */
    tabArray = tabs.split(',');
    tabArray.forEach((item,index)  => {   
        arrayAttribute[item] = [];     
        fs.readdirSync(`${basePath}/public/asset/attributes/${item}`).forEach(file => {
            //console.log('--'+file);
            arrayAttribute[item].push(file);
        });
        //console.log(arrayAttribute);        
    });    

    res.render(`${basePath}/views/pages/attribute.ejs`, { 
        title:'Attributes',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 
        collect :dataAttributes,
        tab:tabArray,
        dataAttribute: arrayAttribute
    });
//console.log(fileAttributes);

})

const uploadAttribute = ((req, res) => {  
    //console.dir(req, { depth: null    })  
    var upload = multer({
            storage: fileUpload.files.storage(), 
            allowedFile:fileUpload.files.allowedFile 
        }).single('file');
    
        upload(req, res, function (err) {
        //console.dir(req.body.layer, { depth: null })  
        if (err instanceof multer.MulterError) {
            res.send(err);
        } else if (err) {
            res.send(err);
        }else{
        //console.log("upladFile : "+ req.file.filename+" done.")
        }
    })
    res.status(200).send(req.file);
});

module.exports = {
    getAttribute,
    uploadAttribute
}