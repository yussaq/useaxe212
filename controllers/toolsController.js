const express = require('express');
const path = require("path");
const router = express.Router();
const basePath = process.cwd();
const fs = require("fs");
const ffmpeg = require('fluent-ffmpeg');
    
const data = [];
const fileSetting = `${basePath}/public/asset/json/setting.json`;
const filePermutation = `${basePath}/public/asset/json/permutation.json`;
const fileMetadata = `${basePath}/public/asset/json/_metadata.json`;      
var dataSetting = JSON.parse(fs.readFileSync(fileSetting));
var dataPermutation = JSON.parse(fs.readFileSync(filePermutation));
var datametadata = JSON.parse(fs.readFileSync(fileMetadata));

const getTools = ((req, res) => {
    res.render(`${basePath}/views/pages/tools.ejs`, { 
        title:'Tools',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 
        infocollection: 'Yours assets/attributes can create max <span class="badge rounded-pill bg-danger">'+Object.keys(dataPermutation).length+'</span> collections, target <span class="badge rounded-pill bg-primary">'+dataSetting[0].quantity+'</span> collections, you have <span class="badge rounded-pill bg-success">999</span> collection now.',
        collect :data 
    });
})

const createMetadata = ((rowdata) => {
    //path.basename(path.dirname(filename));
    attributesList = [];
    rowAttribute = rowdata['attributes'];
    rowAttribute.forEach((val,index)  => {  
        attributesList.push({
            trait_type: path.basename(path.dirname(val)),
            value: path.basename(val).split('.').slice(0, -1).join('.'),            
        });
    })

    //var attributeArray=[]
    var key = 'attributes'// hash1;
    var obj = {}
    var objlayer = {}
    obj['name'] = dataSetting[0].name
    obj['description'] = dataSetting[0].description
    obj['image'] = 'https://'
    obj['dna'] = rowdata['dna']
    obj['edition'] = rowdata['edition']
    obj['type'] = rowdata['type']
    obj['date'] = Date.now()
    obj['creator'] = dataSetting[0].creator
    //obj['status'] = rowdata['status']; //opt: (generate, upload, publish)   
    obj['attributes'] = attributesList
    obj['compiler'] = 'useaxes212'
    return obj
})

const postGenerate = (async (req, res, next) => {
    rowMetadata = []
    /* filter data permutation starus = pendding and quantity = n? */
    randomItem = dataPermutation.filter(({ status }) => status === 'pendding').slice(0, req.body.quantity).sort(() => Math.random() - 0.5)
    for (var i = 0; i <= req.body.quantity-1; i++) {   
        await createCollectionSync(req.body.ffmpeg_path, randomItem[i], i )    
        console.log('save image '+i)
    }
    console.log('FINISH')
    res.redirect(301,'/');
})

const getFileName = (row) => {
    const arrFiles = []   
    const layer = row.layers.split(',')
    const filename = row.attributes.split(',')
    for (var i = 0; i <= layer.length-1; i++) {
        arrFiles.push(`${basePath}/public/asset/attributes/${layer[i]}/${filename[i]}`)
    }
    return arrFiles
}

const getComplexFilter = (row) => {
    const complexFilterObj = []; 
    const layer = row.layers.split(',')
    for (var index = 0; index <= layer.length-1; index++) {        
        if(index < layer.length-1){
        layerFilter = {
            inputs: (index === 0 ? ['0:v', '1:v']  : [`${basePath}/public/asset/attributes/tmp.png`, `${index+1}:v`]),
            filter:  "overlay=0:0:format=rgb[overlayed];[overlayed]split[a][b];[a]palettegen=stats_mode=diff[palette];[b][palette]paletteuse",
            outputs: (index === layer.length-2 ? null : `${basePath}/public/asset/attributes/tmp.png`)            
        }        
        complexFilterObj.push(layerFilter)
        }
    }    
    return  complexFilterObj
}

function createCollectionSync(ffmpegpath, row, rodId ){
    return new Promise((resolve,reject)=>{
        const command = ffmpeg();
        ffmpeg.setFfmpegPath(ffmpegpath);
        var gif = false;
        var ext = 'gif';
        const attribute = getFileName(row)
        attribute.forEach(async(fileName, index )=>{
            try{
                extension = fileName.split('.').pop();
                if(extension.toLowerCase() == 'gif')  gif = true        
                command.input(fileName)
            }catch(err){
                console.log(err)
            }
        })
        if(gif == true ){ ext = 'gif'} else{ ext='png' }
        command.complexFilter(getComplexFilter(row) )
        /* 
        command.on('progress', function(progress) {
            console.log('Processing: ' + progress.timemark + ' done ' + progress.targetSize+' kilobytes');
            })
        */
        command.on('end', function (err, stdout, stderr) {
            return resolve()
            console.log('Finished processing!' /*, err, stdout, stderr*/)
        })
        command.save(`${basePath}/public/asset/collections/image${rodId}.${ext}`)
        //dataMetadata.push(objMetadata(rodId, ext, dataPermutation[rodId]))
    })
}

const postReset = ((req, res, next) => {
    var attributeJson    = `${basePath}/public/asset/json/attributes.json`;
    var settingJson      = `${basePath}/public/asset/json/setting.json`;    
    var permutationJson  = `${basePath}/public/asset/json/permutation.json`;
    const dirattributes  = `${basePath}/public/asset/attributes/`
    const dircollections = `${basePath}/public/asset/collections/`    

    const newdata = { 
        id: 1,
        name: 'my collection',
        description : 'my best collection',
        quantity : 100,
        ipfs : 'https://',
        creator: 'Yussaq NF',
        attributes : 'background'
    };

    var datasetting = [];
    datasetting.push(newdata);
    fs.writeFile(settingJson, JSON.stringify(datasetting), (err) => {
        if (err)
        console.log(err);
    });

    var dataPermutation = [];
    fs.writeFile(permutationJson, JSON.stringify(dataPermutation), (err) => {
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
        fs.statSync(dirattributes);
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
        fs.statSync(dircollections);
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

    if (!fs.existsSync(`${basePath}/public/asset/attributes`)) {
        fs.mkdirSync(`${basePath}/public/asset/attributes`, { recursive: true });
//        fs.mkdir(`${basePath}/public/asset/attributes`);
    }
    if (!fs.existsSync(`${basePath}/public/asset/collections`)) {
        fs.mkdir(`${basePath}/public/asset/collections`);
    }        

    if (!fs.existsSync(`${basePath}/public/asset/attributes/background`)) {
        fs.mkdirSync(`${basePath}/public/asset/attributes/background`, { recursive: true });
    }    

    res.redirect(301,'/setting');
})

module.exports = {
    getTools,
    postGenerate,
    postReset,
    createMetadata
}