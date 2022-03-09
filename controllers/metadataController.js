const express = require('express');
const basePath = process.cwd();
const fs = require("fs");

//const fileName = basePath+"./public/asset/json/test.json";
//const fileName = "./public/asset/json/collections.json";

//let metadatas = JSON.parse(fs.readFileSync(fileName));
const getMetadatas = ((req, res) => {
    res.json(metadatas)
})

const getMetadata = ((req, res) => {
    const id = Number(req.params.metadataID)
    const metadata = metadatas.find(metadata => metadata.id === id)
        if (metadata) {
        return res.status(404).send('Metadata not found')
    }
    res.json(metadata)
})

/* GET users listing. */
const createMetadata = ('/', function(req, res, next) {
    const file = require(fileName);
    var last = data[data.length - 1]        
    let newdata = { 
        id:Number(last.id) + 1,
        file: '5.png',
        name: 'Mike'
    };
    data.push(newdata)   
    fs.writeFile(fileName, JSON.stringify(data), (err) => {
        if (err) throw err         
            console.log("Updated...")     
        });
        res.json(data)
});



const createMetadataxxx = ((req, res) => {
    const newMetadata = {
        id: metadatas.length + 1,
        name: 'nama',//req.body.name,
        file: req.body.price
    }
    metadatas.push(newMetadata)
//    data.push(newdata)   
    fs.writeFile(fileName, JSON.stringify(metadatas), (err) => {
        if (err) throw err         
            console.log("Updated...")     
        });
        res.json(data)
    res.status(201).json(newMetadata)

})

const updateMetadata = ((req, res) => {
    const id = Number(req.params.MetadataID)
    const index = metadatas.findIndex(metadata => metadata.id === id)
    const updatedMetadata = {
        id: metadatas[index].id,
        name: req.body.name,
        price: req.body.price
    }

    metadatas[index] = updatedMetadata
    res.status(200).json('Metadata updated')
})

const deleteMetadata = ((req, res) => {
    const id = Number(req.params.metadataID)
    const index = metadatas.findIndex(metadata => metadata.id === id)
    metadatas.splice(index,1)
    res.status(200).json('Metadata deleted')
})

module.exports = {
    getMetadatas,
    getMetadata,
    createMetadata,
    updateMetadata,
    deleteMetadata
}