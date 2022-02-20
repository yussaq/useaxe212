const multer = require('multer');
const basePath = process.cwd();
module.exports.files={
    storage:function(){ 
        var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            console.dir(req.body.layer, { depth: null    })    
            const layer = req.body.layer;           
          cb(null, `${basePath}/public/asset/attributes/${layer}`)
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        }
      })      
      return storage;
    },
}