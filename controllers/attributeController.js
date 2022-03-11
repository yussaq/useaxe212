/*################################################################################################*\
#                                                                                                  #
#     .01   10.        .0101010.        .0110110.        .0010010.  100         011  .0101010.     #
#   10100   00101    0101010101010    0100101101100    1010010010100  010     110  0101001010100   #
#  0100       0101  1010             0110       0010             0110  010   010  0110       0010  #
# 010           000101011001101010010101010100101101001001001001010010  0011100  01101001010101010 #
#  1000       0010             0110  0010             0010       0110  010   000  0110             #
#   0010101010100    0110110010100    0110101010110    0110100101010  011     101  0110111010010   #
#     '0101010'        '0100100'        '0100100'        '1001010'  010         010  '0110100'     #
#                                                                                                  #
\*################################################################################################*/

const express = require('express');
const router = express.Router();
const crypto = require("crypto");
const basePath = process.cwd();
const fs = require("fs");
const multer = require("multer");
const fileUpload= require('../middlewares/upload-middleware');

//const filePermutation = `${basePath}/public/asset/json/_permutation.json`;      
//const dataPermutation = JSON.parse(fs.readFileSync(filePermutation));

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
    const fileSetting = `${basePath}/public/asset/json/_setting.json`;
    const dataSetting = JSON.parse(fs.readFileSync(fileSetting));
    const filePermutation = `${basePath}/public/asset/json/_permutation.json`;
    const dataPermutation = JSON.parse(fs.readFileSync(filePermutation));
    const fileMetadata = `${basePath}/public/asset/json/_metadata.json`;
    const dataMetadata = JSON.parse(fs.readFileSync(fileMetadata));        
    const arrayAttribute = [];
    const tabs = dataSetting[0].attributes;
    tabArray = tabs.split(',');
    tabArray.forEach((item,index)  => {   
        arrayAttribute[item] = [];     
        fs.readdirSync(`${basePath}/public/asset/attributes/${item}`).forEach(file => {
            arrayAttribute[item].push(file);
        });
    });
    
    const totalCollections = dataMetadata.length;
    const totalUpload = dataMetadata.filter( ({status}) => status === "upload").length;
    //result = newresult.filter(({ attributes,status }) => !attributes.includes(item) && status === 'pendding');                
    //console.log(JSON.stringify(tabArray, null, 2));
    totalmax = dataPermutation.length
    res.render(`${basePath}/views/pages/attribute.ejs`, { 
        title:'Attributes',
        description:    'Yours assets/attributes can create max <span class="badge rounded-pill bg-danger">'+totalmax+
                        '</span> collections, target <span class="badge rounded-pill bg-primary">'+
                        dataSetting[0].quantity+'</span> collections, you have <span class="badge rounded-pill bg-success">'+totalCollections
                        +'</span> collections, uploaded <span class="badge rounded-pill bg-info">'+totalUpload
                        +'</span>', 
        tab:tabArray,
        dataAttribute: arrayAttribute,        
    });
})

const createPermutation = () => {
    const filePermutation = `${basePath}/public/asset/json/_permutation.json`;      
    const dataPermutation = JSON.parse(fs.readFileSync(filePermutation));    
    const fileSetting = `${basePath}/public/asset/json/_setting.json`;  
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
    var arraylayer = dataPermutation;
    layerPermutation.forEach((permutation,index)  => {
        attributesList = [];
        rowper = [];
        var vtime = Date.now();
        rowAttribute = permutation.split(',');
        var DNA = crypto.createHmac("sha256", permutation).digest("hex");
        var objlayer = {};
        objlayer['dna']= DNA;
        objlayer['status'] = 'pendding'; //opt: (generate, upload, publish) 
        objlayer['layers']= layers; //layerArray;
        objlayer['attributes']= permutation; //rowAttribute;        
        const permutationExists = dataPermutation.some(permutation => permutation.dna === DNA);
        if(permutationExists) {
            //console.log('exists ',DNA);
        }else{
            arraylayer.push(objlayer);
        }
    })
    return arraylayer; 
}  

/* upload multiple file  */
const uploadAttribute = ((req, res, next) => {  
    var upload = multer({
            storage: fileUpload.files.storage(), 
            allowedFile:fileUpload.files.allowedFile 
        }).single('file');
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

const checkPermutation = (newPermutation) => {
    const filePermutation = `${basePath}/public/asset/json/_permutation.json`;      
    const dataPermutation = JSON.parse(fs.readFileSync(filePermutation));
    const permutationExists = dataPermutation.some(permutation => permutation.dna === newPermutation.dna);
    if(permutationExists) {
        console.log('exists');
    }else(
        dataPermutation.push(newPermutation)
    )
    
    var permutationJson = `${basePath}/public/asset/json/_permutation.json`;   
    fs.writeFile(permutationJson, JSON.stringify(arraylayer, null, 2), (err) => {
        if (err)
            console.log(err);
        else {
            res.redirect(301,'/attributes'); 
        }
    });
}

/* permtutation from attribute in layer recursive array */
//function getPermutations(layerfiles) {
const getPermutations = ((layerfiles) => {    
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
})

/* create data permutation json */
const permutationAttribute = ((req, res, next) => {  
        var permutationJson = `${basePath}/public/asset/json/_permutation.json`;   
        fs.writeFile(permutationJson, JSON.stringify(createPermutation(), null, 2), (err) => {
            if (err)
                console.log(err);
            else {
                res.redirect(301,'/attributes'); 
            }
        });
});

const deleteAttribute = ((req, res, next) => {  
    const filePermutation = `${basePath}/public/asset/json/_permutation.json`;      
    var newresult = JSON.parse(fs.readFileSync(filePermutation));
    req.body.checkatribute.forEach((item,index)  => {        
        var pathfile = `${basePath}/public/asset/attributes/${req.body.layer}/${item}`;
        //console.log(pathfile);
        if (fs.existsSync(pathfile)) {
            fs.unlink(pathfile, function (err) {
                if (err) throw err;
            }); 
        }
        result = newresult.filter(({ attributes,status }) => !attributes.includes(item) && status === 'pendding');                
        newresult = result;
        //newresult = JSON.stringify(result,null,2);
    });  

    var newdata = `${basePath}/public/asset/json/_permutation.json`;    
    fs.writeFile(newdata, JSON.stringify(newresult,null,2), (err) => {
        if (err)
        console.log(err);
    });    
    //console.log(newresult);
    res.redirect('/attributes');
});

module.exports = {
    getAttribute,
    uploadAttribute,
    permutationAttribute,
    deleteAttribute
}