const express = require('express');
const router = express.Router();
const basePath = process.cwd();
const fs = require("fs");
const multer = require("multer");
//const upload = multer({ dest: `${basePath}/public/asset/attributes` })
const fileUpload= require('../middlewares/upload-middleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, `${basePath}/public/asset/attributes`);
  },
  filename: (req, file, cb) => {
      cb(null, Date.now()+'-'+file.originalname);
  }
});

const getAttribute = ((req, res, next) => {
    const fileAttributes = `${basePath}/public/asset/json/attributes.json`; 
    const fileSetting = `${basePath}/public/asset/json/setting.json`;  
    const dataAttributes = JSON.parse(fs.readFileSync(fileAttributes));
    const dataSetting = JSON.parse(fs.readFileSync(fileSetting));    
    ///const dirAttribute = [];
    const arrayAttribute = [];
    const tabs = dataSetting[0].attributes;

    tabArray = tabs.split(',');
    tabArray.forEach((item,index)  => {   
        arrayAttribute[item] = [];     
        fs.readdirSync(`${basePath}/public/asset/attributes/${item}`).forEach(file => {
            arrayAttribute[item].push(file);
        });
    });    

    //console.log(JSON.stringify(tabArray, null, 2));
    res.render(`${basePath}/views/pages/attribute.ejs`, { 
        title:'Attributes',
        description: 'Yours assets/attributes can create max xxx collections, target xxx collections, you have xxx collection now.', 
        collect :dataAttributes,
        tab:tabArray,
        dataAttribute: arrayAttribute
    });
})

const uploadAttribute = ((req, res, next) => {  
    var upload = multer({
            storage: fileUpload.files.storage(), 
            allowedFile:fileUpload.files.allowedFile 
        }).single('file');
        res.redirect('/attributes');    
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                res.send(err);
            } else if (err) {
                res.send(err);
            }
        });
    //res.status(200).send(req.file);
    res.redirect('/attributes');
});

const deleteAttribute = ((req, res, next) => {  

    req.body.checkatribute.forEach((item,index)  => {        
        var pathfile = `${basePath}/public/asset/attributes/${req.body.layer}/${item}`;
        console.log(pathfile);

        if (fs.existsSync(pathfile)) {
            //fs.mkdirSync(`${basePath}/public/asset/attributes/${item}`);
            console.log('File deleted!');
            fs.unlink(pathfile, function (err) {
                if (err) throw err;

                console.log('File deleted!');
            }); 
        }

    });  


    //res.send(pathfile);
    res.redirect('/attributes');
});

module.exports = {
    getAttribute,
    uploadAttribute,
    deleteAttribute
}