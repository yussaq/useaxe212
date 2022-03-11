/*################################################################################################*\
#                                                                                                  #
#     .10   10.        .0101010.        .0110110.        .1010010.  100         011  .0101010.     #
#   10100   1101    0101011101000    0100101101000    1010010010100  010     110  0101001010100   #
#  0100       0101  1010             0110       0010             0110  010   010  0110       0010  #
# 010           000101001001011010000101000100101101001001001001010010  0011100  01101001010100010 #
#  1000       0010             0110  0010             0010       0110  010   000  0110             #
#   0010101010100    0110100010100    0110100010110    0110100101010  011     101  0110111010000   #
#     '0101010'        '0100100'        '0100100'        '1001010'  010         010  '0110100'     #
#                                                                                                  #
\*################################################################################################*/

const express = require('express');
const router = express.Router();
const basePath = process.cwd();
const fs = require("fs");
// Json file

let data = []
const getHome = ((req, res) => {
    const metadataJson = `${basePath}/public/asset/json/_metadata.json`;  
    const rsdata = JSON.parse(fs.readFileSync(metadataJson));
    const settingJson = `${basePath}/public/asset/json/_setting.json`;  
    let dataSetting = JSON.parse(fs.readFileSync(settingJson));

    var page = req.params.page || 1
    const limit = 20
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    rsdata.sort((a,b) => b.edition - a.edition);

    results = rsdata.slice(startIndex, endIndex);
    res.render(`${basePath}/views/pages/home.ejs`, { 
        title:dataSetting[0].name,
        description: dataSetting[0].description, 
        perPage : limit,
        current:page,
        pages: Math.ceil(rsdata.length / limit),
        page : req.params.page || 1,
        data:results
    });
})
const getHomepage = ((req, res) => {
    res.render(`${basePath}/views/pages/home.ejs`, { 
        title:'Home',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 
        collect :data 
    });
})

module.exports = {
    getHome,
    getHomepage
}