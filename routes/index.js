/*################################################################################################*\
#                                                                                                  #
#     .10   10.        .0101010.        .0110110.        .1010010.  100         011  .0101010.     #
#   1010     0101    0101001001000    0100101101000    1010010010100  010     110  0101001010100   #
#  0100       0101  0010             0110       0110             0110  010   010  0110       0010  #
# 010           000001001001011010000101000100101001001001001001010010  0011100  01101001010100010 #
#  1000       0010             0110  0110             1010       0110  010   000  0110             #
#   0010001010100    0010100010100    0110100010110    0110100101010  011     101  0110111010000   #
#     '0101010'        '0100100'        '0100100'        '1001010'  010         010  '0110100'     #
#                                                                                                  #
\*################################################################################################*/

var express = require('express');
const basePath = process.cwd();
var router = express.Router();
const multer = require("multer");
var upload = multer({ dest: `${basePath}/public/asset/attributes` })


/* Home Page */
const  {  
    getHome, 
    getHomepage 
} = require('../controllers/homeController.js')
router.get('/', getHome)
router.get('/home/:page', getHome)

/* Attribute Page */
const  {  
    getAttribute,
    uploadAttribute,
    deleteAttribute,
    permutationAttribute
} = require('../controllers/attributeController.js')
router.get('/attributes', getAttribute)
router.post('/attributes/upload', uploadAttribute)
router.post('/attributes/delete', deleteAttribute)
router.post('/attributes/permutation', permutationAttribute)

/* Setting Page */
const  { 
    getSetting,
    updateSetting 
} = require('../controllers/settingController.js')
router.get('/setting', getSetting)
router.post('/setting/update', updateSetting)


/* Tools Page */
const  { 
    getTools,
    postGenerate,
    postReset,
    postClearGenerate,
    pinFile,
    pinFileToIPFS 
} = require('../controllers/toolsController.js')
router.get('/tools', getTools)
router.post('/tools/generate', postGenerate)
router.post('/tools/reset', postReset)
router.post('/tools/cleargenerate', postClearGenerate)
router.post('/tools/pin-file-to-ipfs', pinFileToIPFS)


/* Metadata page */
const  { 
    getMetadatas,
    getMetadata,
    createMetadata,
    updateMetadata,
    deleteMetadata
} = require('../controllers/metadataController.js')
router.get('/metadata', getMetadatas)
router.get('/metadata/:metadataID', getMetadata)
router.post('/metadata', createMetadata) 
router.put('/metadata/:metadataID', updateMetadata) 
router.delete('/metadata/:metadataID', deleteMetadata)

module.exports = router;
