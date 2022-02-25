const express = require('express');
const router = express.Router();
const crypto = require("crypto");
const basePath = process.cwd();
const fs = require("fs");
const multer = require("multer");
const fileUpload= require('../middlewares/upload-middleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, `${basePath}/public/asset/attributes`);
  },
  filename: (req, file, cb) => {
      cb(null, Date.now()+'-'+file.originalname);
  }
});

/* Show attribute page with information about attribute & collections */
const getAttribute = ((req, res, next) => {
    const fileAttributes = `${basePath}/public/asset/json/attributes.json`; 
    const fileSetting = `${basePath}/public/asset/json/setting.json`;
    const filePermutation = `${basePath}/public/asset/json/permutation.json`;      
    const dataAttributes = JSON.parse(fs.readFileSync(fileAttributes));
    const dataSetting = JSON.parse(fs.readFileSync(fileSetting));
    const dataPermutation = JSON.parse(fs.readFileSync(filePermutation));        
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
        description: 'Yours assets/attributes can create max <span class="badge rounded-pill bg-danger">'+Object.keys(dataPermutation).length+'</span> collections, target <span class="badge rounded-pill bg-primary">'+dataSetting[0].quantity+'</span> collections, you have <span class="badge rounded-pill bg-success">999</span> collection now.', 
        collect :dataAttributes,
        tab:tabArray,
        dataAttribute: arrayAttribute,        
    });
})

/* upload multiple file  */
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

/* permtutation from attribute in layer recursive array */
function getPermutations(layerfiles) {
    let rowresult = [];        
  var keyDNA = 'attributes';// hash1;
  var objDNA = {};
  if (layerfiles.length == 1) {
    return layerfiles[0];
  } else {
    var result = [];
    var allCasesOfRest = getPermutations(layerfiles.slice(1)); // recursive array
    for (var i = 0; i < allCasesOfRest.length; i++) {
        rowresult = []
        for (var j = 0; j < layerfiles[0].length; j++) {
            result.push(layerfiles[0][j] +','+  allCasesOfRest[i]);
        }
        rowresult.push(result[i]);
    }
    return result;
  }
}

/* create data permutation json */
const permutationAttribute = ((req, res, next) => {  
    const fileSetting = `${basePath}/public/asset/json/setting.json`;  
    const dataSetting = JSON.parse(fs.readFileSync(fileSetting));    
    const layers = dataSetting[0].attributes;
    layerArray = layers.split(',');
    const layerfiles = [];
    layerArray.forEach((attribute,index)  => {   
      try {
        const arrayOfFiles = fs.readdirSync("./public/asset/attributes/"+attribute);
        layerfiles[index] = arrayOfFiles;
      } catch(e) {
        console.log(e)
      }
    });  

    const layerPermutation = getPermutations(layerfiles);
    var metadataAttributes = []
    var objAttributes = {}
    var attributeArray=[]
    var arraylayer = []
    let dateTime = Date.now();
    layerPermutation.forEach((permutation,index)  => {  
        attributesList = []
        rowper = []
        var vtime = Date.now();
        rowAttribute = permutation.split(',');
        DNA = '';
        layerArray.forEach((val,index)  => {  
            attributesList.push({
                trait_type: layerArray[index],
                value: rowAttribute[index].split('.').slice(0, -1).join('.'),            
            });
            DNA = DNA+','+rowAttribute[index]
        })
        DNA = DNA.substring(1)
        var hash1 = crypto.createHmac("sha256", DNA).digest("hex")
        metadataAttributes[hash1]= attributesList;
        objAttributes.hash1 = attributesList ;

        var key = 'attributes';// hash1;
        var obj = {};
        var objlayer = {};
        obj['name'] = 'my collection';
        obj['description'] = 'description collection';
        obj['image'] = 'https://';
        obj['dna'] = hash1;
        obj['edition'] = 'edition';
        obj['date'] = dateTime;
        obj['creator'] = 'yussaq';
        obj['status'] = 'pending'; //opt: (generate, upload, publish)   
        obj['attributes'] = attributesList;
        obj['compiler'] = 'useaxes212';
        attributeArray.push(obj);

        var keylayer = hash1;
        var objlayer = {};
        objlayer[keylayer] = rowAttribute;
        arraylayer.push(objlayer);
    })
        /* layerPermutation : data to generate layer create collection  */
        /* metadataAttributes : data to metadata collecton              */
        var permutationJson = `${basePath}/public/asset/json/permutation.json`;     
        fs.writeFile(permutationJson, JSON.stringify(arraylayer, null, 2), (err) => {
            if (err)
            console.log(err);
            else {
            res.redirect(301,'/attributes'); 
            }
        });
//        res.redirect(301,'/attributes');        
});

const deleteAttribute = ((req, res, next) => {  
    req.body.checkatribute.forEach((item,index)  => {        
        var pathfile = `${basePath}/public/asset/attributes/${req.body.layer}/${item}`;
        console.log(pathfile);
        if (fs.existsSync(pathfile)) {
            //fs.mkdirSync(`${basePath}/public/asset/attributes/${item}`);
            //console.log('File deleted!');
            fs.unlink(pathfile, function (err) {
                if (err) throw err;
                //console.log('File deleted!');
            }); 
        }
    });  
    res.redirect('/attributes');
});

module.exports = {
    getAttribute,
    uploadAttribute,
    permutationAttribute,
    deleteAttribute
}