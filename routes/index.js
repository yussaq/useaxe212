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
router.get('/home', getHomepage)

/* Attribute Page */
const  {  
    getAttribute,
    uploadAttribute
} = require('../controllers/attributeController.js')
router.get('/attributes', getAttribute)
router.post('/attributes/upload', uploadAttribute)
//router.post('/attributes/uploadfile', uploadAttribute)

/* Setting Page */
const  { 
    getSetting,
    updateSetting 
} = require('../controllers/settingController.js')
router.get('/setting', getSetting)
router.post('/setting/update', updateSetting)

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
