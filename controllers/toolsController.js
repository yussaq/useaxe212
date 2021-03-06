/*################################################################################################*\
#                                                                                                  #
#     .01   10.        .0101010.        .0110110.        .0010010.  100         011  .0101010.     #
#   10100   10101    0101010101000    0100101101100    1010010010100  010     110  0101001010100   #
#  0100       0101  1010             0110       0010             0110  010   010  0110       0010  #
# 010           000101011001101011000101000100101101001001001001010010  0011100  01101001010100010 #
#  1000       0010             0110  0010             0010       0110  010   000  0110             #
#   0010101010100    0110100010100    0110101010110    0110100101010  011     101  0110111011000   #
#     '0101010'        '0110100'        '0100110'        '1011010'  010         010  '0110100'     #
#                                                                                                  #
\*################################################################################################*/

const express = require('express');
const axios = require("axios");
const https = require('https')
const path = require("path");
const crypto = require("crypto");
const router = express.Router();
const basePath = process.cwd();
const FormData = require('form-data');
const fs = require("fs");
const ffmpeg = require('fluent-ffmpeg');
const basePathConverter = require('base-path-converter');

const xl = require('excel4node');
const wb = new xl.Workbook();
const ws = wb.addWorksheet('metadata');

const data = [];
/* 
const fileSetting = `${basePath}/public/asset/json/_setting.json`;
var dataSetting = JSON.parse(fs.readFileSync(fileSetting));
const filePermutation = `${basePath}/public/asset/json/_permutation.json`;
var dataPermutation = JSON.parse(fs.readFileSync(filePermutation));
*/
const fileSetting = `${basePath}/public/asset/json/_setting.json`;
const dataSetting = JSON.parse(fs.readFileSync(fileSetting));    
const fileMetadata = `${basePath}/public/asset/json/_metadata.json`;      
var dataMetadata = JSON.parse(fs.readFileSync(fileMetadata));

const getTools = ((req, res) => {
    const fileSetting = `${basePath}/public/asset/json/_setting.json`;
    var dataSetting = JSON.parse(fs.readFileSync(fileSetting));
    const filePermutation = `${basePath}/public/asset/json/_permutation.json`;
    var dataPermutation = JSON.parse(fs.readFileSync(filePermutation));
    //const fileMetadata = `${basePath}/public/asset/json/_metadata.json`;      
    //var dataMetadata = JSON.parse(fs.readFileSync(fileMetadata));
    res.render(`${basePath}/views/pages/tools.ejs`, { 
        title:'Tools',
        description: 'Generate/create NFT collection and metadata, ready upload to IPFS (pinata)', 
        infocollection: 'Yours assets/attributes can create max <span class="badge rounded-pill bg-danger">'+dataPermutation.length+'</span> collections, target <span class="badge rounded-pill bg-primary">'+dataSetting[0].quantity+'</span> collections, you have <span class="badge rounded-pill bg-success">'+dataMetadata.length+'</span> collections.',
        collect :data 
    });
})

const camelCaseToStringSpace = (s) => {
    return s
        .split(/(?=[A-Z])/)
        .map((p) => {
            return p[0].toUpperCase() + p.slice(1);
        })
        .join(' ');
}

const objMetadata = ((edition, type, rowdata) => {
    const fileSetting = `${basePath}/public/asset/json/_setting.json`;
    var dataSetting = JSON.parse(fs.readFileSync(fileSetting)); 
    if (dataSetting[0].imgname === null || dataSetting[0].imgname === undefined) { 
        var layer_imgname = ''
        var arr_layer_imgname = []        
    } else {
        var layer_imgname = dataSetting[0].imgname
        var arr_layer_imgname = layer_imgname.split(',')
    }
    attributesList = [];
    subname = '';
    subname1 = '';
    rowAttribute = getFileName(rowdata);
    rowAttribute.forEach((val,index)  => {  
        attribute_type = path.basename(path.dirname(val))
        attribute_value = path.basename(val).split('.').slice(0, -1).join('.')

        if (attribute_type === arr_layer_imgname[0]) {
            subname = camelCaseToStringSpace(attribute_value)
        }

        if (attribute_type === arr_layer_imgname[1]) {
            subname1 = camelCaseToStringSpace(attribute_value)
        }        
        attributesList.push({
            trait_type: attribute_type, // path.basename(path.dirname(val)),
            value: attribute_value, // path.basename(val).split('.').slice(0, -1).join('.'),            
        });
    })
    var DNA = crypto.createHmac("sha256", rowdata.attributes).digest("hex");
    var obj = {}
    var objlayer = {}
    obj['name'] = `${camelCaseToStringSpace(dataSetting[0].name)} #${edition} ${subname} ${subname1}`  //'#'+edition
    obj['description'] = dataSetting[0].description
    obj['image'] = 'https://'
    obj['dna'] = DNA
    obj['edition'] = edition
    obj['type'] = type
    obj['date'] = Date.now()
    obj['creator'] = dataSetting[0].creator
    obj['attributes'] = attributesList
    obj['compiler'] = 'useaxes212'
    return obj
})

const createMetadata = ((rowdata) => {
    const fileSetting = `${basePath}/public/asset/json/_setting.json`;
    var dataSetting = JSON.parse(fs.readFileSync(fileSetting));    
    if (dataSetting[0].imgname === null || dataSetting[0].imgname === undefined) { 
        var layer_imgname = ''
    } else {
        layer_imgname = dataSetting[0].imgname
    }
    attributesList = [];
    subname = '';
    rowAttribute = rowdata['attributes'];
    rowAttribute.forEach((val,index)  => {
        attribute_type = path.basename(path.dirname(val))
        attribute_value = path.basename(val).split('.').slice(0, -1).join('.')

        if (attribute_type === layer_imgname) {
            subname = attribute_value
        }
        attributesList.push({
            trait_type: attribute_type, //path.basename(path.dirname(val)),
            value: attribute_value, // path.basename(val).split('.').slice(0, -1).join('.'),            
        });
    })

    var key = 'attributes'// hash1;
    var obj = {}
    var objlayer = {}
    obj['name'] = `${dataSetting[0].name} ${subname}`
    obj['description'] = dataSetting[0].description
    obj['image'] = 'https://'
    obj['dna'] = rowdata['dna']
    obj['edition'] = rowdata['edition']
    obj['type'] = rowdata['type']
    obj['date'] = Date.now()
    obj['creator'] = dataSetting[0].creator 

    obj['attributes'] = attributesList
    obj['compiler'] = 'useaxes212'
    return obj
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

function createCollectionSync(row, rodId ){
    const fileSetting = `${basePath}/public/asset/json/_setting.json`;
    var dataSetting = JSON.parse(fs.readFileSync(fileSetting));
    //const fileMetadata = `${basePath}/public/asset/json/_metadata.json`;      
    //var dataMetadata = JSON.parse(fs.readFileSync(fileMetadata));
    return new Promise((resolve,reject)=>{
        const command = ffmpeg();
        ffmpeg.setFfmpegPath(dataSetting[0].ffmpeg);
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
        command.save(`${basePath}/public/asset/collections/${rodId}.${ext}`)
        var imageMetadata = objMetadata(rodId, ext, row)

        dataMetadata.push(objMetadata(rodId, ext, row))
        /* create single file metadata  */
        fs.appendFile(`${basePath}/public/asset/json/metadata/${rodId}.json`,   JSON.stringify(imageMetadata, null, 2) , function (err) {
            if (err) throw err;
        });        
    })
}

const randomize = (arr) => {
    var i, j, tmp;
    for (i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }
    return arr;
}

const postGenerate = (async (req, res, next) => {
    const filePermutation = `${basePath}/public/asset/json/_permutation.json`;    
    const dataPermutation = JSON.parse(fs.readFileSync(filePermutation));    
    const filterItem = dataPermutation.filter(({ status }) => status === 'pendding')
    //const fileMetadata = `${basePath}/public/asset/json/_metadata.json`;      
    //var dataMetadata = JSON.parse(fs.readFileSync(fileMetadata));
    lastEdition = dataMetadata.length
    rowMetadata = []
    findidx = []
    randomItem = randomize(filterItem)                                                                   
    for (var i = 0; i <= req.body.quantity-1; i++) {
        await createCollectionSync(randomItem[i], i+lastEdition+1 )    
        console.log('save image '+i)
        var index = dataPermutation.findIndex(obj => obj.dna===randomItem[i].dna);   
        findidx.push(index)     
        //loading
    }

    findidx.forEach(async(val, index) => {
        dataPermutation[val].status = 'generate'
    })

    //filePermutation    
    fs.writeFileSync(filePermutation, JSON.stringify(dataPermutation, null, 2), (err) => { 
        if (err) throw err; 
        //console.log('The file has been saved!'); 
    })
    var metadataJson = `${basePath}/public/asset/json/_metadata.json`;   
/* 
    fs.writeFileSync(metadataJson, JSON.stringify(dataMetadata, null, 2), (err) => {
        if (err) console.log(err);
    });
 */ 

    try {
        fs.writeFileSync(metadataJson, JSON.stringify(dataMetadata, null, 2))
        console.log("File written successfully");
    } catch(err) {
        console.error(err);
    }    
    jsontoexcel()
    //updatePermutation = dataPermutation
    console.log('Generate done')
    res.redirect(301,'/');
})

const postReset = (async(req, res, next) => {
    var metadataJson     = `${basePath}/public/asset/json/_metadata.json`
    var settingJson      = `${basePath}/public/asset/json/_setting.json` 
    var permutationJson  = `${basePath}/public/asset/json/_permutation.json`
    var ipfsImagesJson   = `${basePath}/public/asset/json/_ipfsImages.json`
    var ipfsMetadataJson = `${basePath}/public/asset/json/_ipfsMetadata.json`
    const dirattributes  = `${basePath}/public/asset/attributes/`
    const dircollections = `${basePath}/public/asset/collections/`
    const dirmetadata    = `${basePath}/public/asset/json/metadata/`    

    const newdata = { 
        id: 1,
        name: 'Hello World',
        initial: 'HW',
        description : 'Hello World NFT collection',
        quantity : 10,
        ipfs : 'https://',
        creator: 'Yussaq NF',
        attributes : 'background',
        ffmpeg : "/usr/bin/ffmpeg"  // "c:\\ffmpeg\\bin\\ffmpeg.exe" //linux-> /usr/bin/ffmpeg
    };

    var datasetting = [];
    datasetting.push(newdata);
    fs.writeFile(settingJson, JSON.stringify(datasetting, null, 2), (err) => {
        if (err)
        console.log(err);
    });

    var dataPermutation = [];
    fs.writeFile(permutationJson, JSON.stringify(dataPermutation), (err) => {
        if (err)
        console.log(err);
    });    

    var datacollections = [];
    fs.writeFile(metadataJson, JSON.stringify(datacollections), (err) => {
        if (err)
        console.log(err);
    });
    
    fs.writeFile(ipfsImagesJson, JSON.stringify([]), (err) => {
        if (err)
        console.log(err);
    });    

    try {
        if (fs.existsSync(dirattributes)) {
        fs.statSync(dirattributes);
        //console.log('file or directory exists');
        fs.rmdirSync(dirattributes,{ recursive: true }, (err) => {
            if (err) {
                throw err;
            }    
            console.log(`dirattributes is deleted!`);
            return true;
        });
        }
    }
    catch (err) {
        if (err.code === 'ENOENT') {
            console.log('file or dirattributes does not exist');
        }
    }

    try {
        if (fs.existsSync(dircollections)) {
            fs.statSync(dircollections);
            //console.log('file or directory exists');
            fs.rmdirSync(dircollections, { recursive: true },(err) => {
                if (err) {
                    throw err;
                }    
                console.log(`dircollections is deleted!`);
                return true;
            });
        }
    }
    catch (err) {
        if (err.code === 'ENOENT') {
        console.log('file or dircollections does not exist');
        }
    }

    try {
        if (fs.existsSync(dirmetadata)) {        
        fs.statSync(dirmetadata);
        //console.log('file or directory exists');
        fs.rmdirSync(dirmetadata,{ recursive: true }, (err) => {
            if (err) {
                throw err;
            }    
            console.log(`dirmetadata is deleted!`);
            return true;
        });
        }
    }
    catch (err) {
        if (err.code === 'ENOENT') {
        console.log('file or directory does not exist');
        }
    }    

    if (!fs.existsSync(`${basePath}/public/asset/attributes`)) {
        fs.mkdirSync(`${basePath}/public/asset/attributes/`);
        console.log(`dirattributes created`);
    }
    if (!fs.existsSync(`${basePath}/public/asset/attributes/background`)) {
        fs.mkdirSync(`${basePath}/public/asset/attributes/background/`);        
        console.log(`dirbackground created`);
    }       

    if (!fs.existsSync(`${basePath}/public/asset/collections`)) {
        fs.mkdirSync(`${basePath}/public/asset/collections/`);
        console.log(`dircollections created`);
    }

    if (!fs.existsSync(`${basePath}/public/asset/json/metadata`)) {
        fs.mkdirSync(`${basePath}/public/asset/json/metadata/`);
        console.log(`dirmetadata created`);
    }    


    res.redirect('/setting');
    //res.redirect(301,'/setting');
})

const postClearGenerate = (async(req, res, next) => {
    var metadataJson     = `${basePath}/public/asset/json/_metadata.json`
    var settingJson      = `${basePath}/public/asset/json/_setting.json` 
    var permutationJson  = `${basePath}/public/asset/json/_permutation.json`
    var ipfsImagesJson   = `${basePath}/public/asset/json/_ipfsImages.json`
    var ipfsMetadataJson = `${basePath}/public/asset/json/_ipfsMetadata.json`
    const dirattributes  = `${basePath}/public/asset/attributes/`
    const dircollections = `${basePath}/public/asset/collections/`
    const dirmetadata    = `${basePath}/public/asset/json/metadata/`    

    var dataPermutation = [];
    fs.writeFile(permutationJson, JSON.stringify(dataPermutation), (err) => {
        if (err)
        console.log(err);
    });    

    var datacollections = [];
    fs.writeFile(metadataJson, JSON.stringify(datacollections), (err) => {
        if (err)
        console.log(err);
    });
    
    fs.writeFile(ipfsImagesJson, JSON.stringify([]), (err) => {
        if (err)
        console.log(err);
    });    

    try {
        if (fs.existsSync(dircollections)) {
            fs.statSync(dircollections);
            //console.log('file or directory exists');
            fs.rmdirSync(dircollections, { recursive: true },(err) => {
                if (err) {
                    throw err;
                }    
                console.log(`dircollections is deleted!`);
                return true;
            });
        }
    }
    catch (err) {
        if (err.code === 'ENOENT') {
        console.log('file or dircollections does not exist');
        }
    }

    try {
        if (fs.existsSync(dirmetadata)) {        
        fs.statSync(dirmetadata);
        //console.log('file or directory exists');
        fs.rmdirSync(dirmetadata,{ recursive: true }, (err) => {
            if (err) {
                throw err;
            }    
            console.log(`dirmetadata is deleted!`);
            return true;
        });
        }
    }
    catch (err) {
        if (err.code === 'ENOENT') {
        console.log('file or directory does not exist');
        }
    }     

    if (!fs.existsSync(`${basePath}/public/asset/collections`)) {
        fs.mkdirSync(`${basePath}/public/asset/collections/`);
        console.log(`dircollections created`);
    }

    if (!fs.existsSync(`${basePath}/public/asset/json/metadata`)) {
        fs.mkdirSync(`${basePath}/public/asset/json/metadata/`);
        console.log(`dirmetadata created`);
    }    
    res.redirect('/setting');
    //res.redirect(301,'/setting');
})

const updateSingleMetadata = (IpfsHash, editionIdx) => {
    //const urlipfs = `ipfs://gateway.pinata.cloud/ipfs/${IpfsHash}`
    editionIdx.forEach(async(val, idx) => {
        var singleJson = `${basePath}/public/asset/json/metadata/${val}.json`;
        var singleMetadata = JSON.parse(fs.readFileSync(singleJson));   
        singleMetadata.image = `ipfs://${IpfsHash}/${singleMetadata.edition}.${singleMetadata.type}`
        fs.writeFileSync(singleJson, JSON.stringify(singleMetadata, null, 2), (err) => { 
            if (err) throw err; 
            console.log('Update : '+ `${val}.json`); 
        })
    })    
    console.log(`Proccess upload ${editionIdx.length} metadata ....`);
}

const instanceAxios = axios.create({
    maxBodyLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
    timeout: 160000,
    httpsAgent: new https.Agent({ keepAlive: true }),    
});
    

const pinMetadataToIPFS = (async (maxPart,editionIdx,ApiKey,SecretApiKey) => {    
    const fileSetting = `${basePath}/public/asset/json/_setting.json`;
    const dataSetting = JSON.parse(fs.readFileSync(fileSetting));

    const fileipfsMetadata = `${basePath}/public/asset/json/_ipfsMetadata.json`;
    const dataipfsMetadata = JSON.parse(fs.readFileSync(fileipfsMetadata));

    const urljson = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const srcjson = `${basePath}/public/asset/json/metadata`;
    let dataJson = new FormData();
        
    editionIdx.forEach(async(val, idx) => {
        filename = `${basePath}/public/asset/json/metadata/${val}.json`
        dataJson.append('file', fs.createReadStream(filename), {
            filepath: basePathConverter(srcjson, filename)
        });
    })
    const partJson = maxPart+1
    const partname = dataSetting[0].initial+'_part_'+partJson+'_metadata'
    const metadataJson = JSON.stringify({
        name: partname, // dataSetting[0].initial+'_part_'+partJson+'_metadata',
        keyvalues: {
            uploadedby: 'useaxe212',
            total : editionIdx.length
        },
    });    
    dataJson.append('pinataMetadata', metadataJson);
    const config = {
        headers: {
            'Content-Type': `multipart/form-data; boundary=${dataJson._boundary}`,
            pinata_api_key: ApiKey,
            pinata_secret_api_key: SecretApiKey        
        },
        onUploadProgress: progressEvent => {
            var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            console.log('Upload Image : '+ percentCompleted + '%');
        }
    }        
    instanceAxios
        .post(urljson, dataJson, config)
        .then(function (response) {
            try{
                console.log('Upload metadata done');
                dataipfsMetadata.push({ part: partname, IpfsHash: response.data.IpfsHash,'editions': editionIdx});
                fs.writeFileSync(fileipfsMetadata, JSON.stringify(dataipfsMetadata, null, 2), (err) => { 
                    if (err) throw err; 
                })

            }catch(err){
                console.log(err)
                console.log('ERROR : pinMetadataToIPFS')
            }
            //res.redirect(301, '/tools');    
        })
        .catch(function (error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
            //console.log(error);
            console.log('ERROR : pinMetadataToIPFS')
        });      
})

const pinFileToIPFS = (async (req, res, next) => {    
    const fileSetting = `${basePath}/public/asset/json/_setting.json`;
    const dataSetting = JSON.parse(fs.readFileSync(fileSetting));    
    const fileMetadata = `${basePath}/public/asset/json/_metadata.json`;    
    const dataMetadata = JSON.parse(fs.readFileSync(fileMetadata));
    const fileIpfsImages = `${basePath}/public/asset/json/_ipfsImages.json`;    
    const dataIpfsImages = JSON.parse(fs.readFileSync(fileIpfsImages));

    const filterItem = dataMetadata.filter(({ status }) => status !== 'upload')
    const maxPart = Math.max(...dataMetadata.map(o => o.part).filter(part => part > 0 ), 0);
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const src = `${basePath}/public/asset/collections`;
    let data = new FormData();    
    findidx = []
    editionIdx = []
    for (var i = 0; i < req.body.quantity; i++) {
        //console.log('proccess img '+i)
        var index = dataMetadata.findIndex(obj => obj.dna===filterItem[i].dna);   
        dataMetadata[index].status = 'upload'
        dataMetadata[index].part = maxPart+1;                
        filename = `${basePath}/public/asset/collections/${filterItem[i].edition}.${filterItem[i].type}`
        data.append('file', fs.createReadStream(filename), {
            filepath: basePathConverter(src, filename)
        });
        editionIdx.push(filterItem[i].edition)     
    }
    console.log(`Proccess upload ${editionIdx.length} images ....`)
    var partImage = maxPart+1
    const partImagename = dataSetting[0].initial+'_part_'+partImage+'_images'
    const metadata = JSON.stringify({
        name: partImagename, //dataSetting[0].initial+'_part_'+partImage+'_images',
        keyvalues: {
            uploadedby: 'useaxe212',
            total : req.body.quantity
        },
    });
    data.append('pinataMetadata', metadata);    
    const config = {
        headers: {
            'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
            pinata_api_key: req.body.pinataApiKey,
            pinata_secret_api_key: req.body.pinataSecretApiKey            
        },
        onUploadProgress: progressEvent => {
          var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          console.log('Upload Image : '+ percentCompleted + '%');
        }
    }

    instanceAxios
        .post(url, data, config)
        .then( response => {
            //console.log(response.data.IpfsHash);
            console.log('Upload image done');  
            fs.writeFileSync(fileMetadata, JSON.stringify(dataMetadata, null, 2), (err) => { 
                if (err) throw err; 
                //console.log('The file has been saved!'); 
            })
            try{
                updateSingleMetadata(response.data.IpfsHash, editionIdx)
                //console.log(JSON.stringify(rsIpfsHashImg, null, 2));
                dataIpfsImages.push({ 'part': partImagename, 'IpfsHash': response.data.IpfsHash,'editions': editionIdx });
                fs.writeFileSync(fileIpfsImages, JSON.stringify(dataIpfsImages, null, 2), (err) => { 
                    if (err) throw err; 
                })
            }catch(err){
                console.log(err)
                console.log('ERROR : pinFileToIPFS')
            }

            try{
                pinMetadataToIPFS(maxPart, editionIdx,req.body.pinataApiKey,req.body.pinataSecretApiKey)
                //console.log('pinMetadataToIPFS')
            }catch(error){
                if (error.response) {
                    // The request was made
                    // the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log("error response :");
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                  } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest 
                    // is an instance of http.ClientRequest in node.js
                    console.log("error request :");
                    console.log(error.request);
                  } else {
                    // Something happened in setting up the request 
                    // that triggered an Error
                    console.log('Error', error.message);
                  }
                  //console.log(error.config);
                  console.log('ERROR pinFileToIPFS')
            }                        
            res.redirect(301, '/tools');    
        })
        .catch(error => {
            console.log(error);
        });    
});

const jsontoexcel = () => {
    const fileMetadata = `${basePath}/public/asset/json/_metadata.json`;      
    var dataMetadata = JSON.parse(fs.readFileSync(fileMetadata));    
    ws.cell(1, 1).string('EDITION');
    ws.cell(1, 2).string('NAME');
    ws.cell(1, 3).string('DESCRIPTION');
    ws.cell(1, 4).string('TRAIT_TYPE');
    ws.cell(1, 5).string('VALUE');
    
    let rowIndex = 2;
    dataMetadata.forEach( record => {
    //    let columnIndex = 1;
        ws.cell(rowIndex,1).number(record ['edition'])
        ws.cell(rowIndex,2).string(record ['name'])
        ws.cell(rowIndex,3).string(record ['description'])
        atribute = record ['attributes']
        atribute.forEach( attr => {
            ws.cell(rowIndex,4).string(attr ['trait_type'])
            ws.cell(rowIndex,5).string(attr ['value'])
            rowIndex++;        
        })        
        rowIndex++;
    });     
    wb.write(`${basePath}/public/asset/json/_metadata.xlsx`);
};

module.exports = {
    getTools,
    postGenerate,
    postReset,
    postClearGenerate,
    createMetadata,
    pinFileToIPFS,
    jsontoexcel
}