var express = require('express');
var router = express.Router();

/* Home Page */
const  {  
    getHome, 
    getHomepage 
} = require('../controllers/homeController.js')
router.get('/', getHome)
router.get('/home', getHomepage)

/* Attribute Page */
const  {  
    getAttribute
} = require('../controllers/attributeController.js')
router.get('/attributes', getAttribute)

/* Setting Page */
const  { 
    getSetting 
} = require('../controllers/settingController.js')
router.get('/setting', getSetting)

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
