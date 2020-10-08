const express = require("express") ;
const path = require("path") ;
const multer = require("multer") ;
const router = express.Router();
const mongoose = require('mongoose');
const GridFsStorage = require('multer-gridfs-storage')
const MONGOURI = "mongodb+srv://dbKrishna:Kri75676@cluster0-9vtky.mongodb.net/uploaded-files?retryWrites=true&w=majority";
const promise = require('promise');
var crypto = require('crypto');
var mongoD = require("../config/db");

 // var conn = mongoose.connection;
 const conn = mongoose.createConnection(MONGOURI, {useNewUrlParser : true, useUnifiedTopology:true})
// mongoose.set({useUnifiedTopology: true, useNewUrlParser: true})
// const conn = await MongoClient.connect(MONGOURI , { useUnifiedTopology: true, useNewUrlParser: true, } );

let gfg;
conn.once("open",(err,res)=>{
    try{
 gfg = new mongoose.mongo.GridFSBucket(conn.db, {bucketName :"uploads" } )
    }
    catch(err)
    {
        res.json({
            err: message
        })
        console.log(err);
    }
} )

const storage = new GridFsStorage({
    url : MONGOURI,
    file : (req,file) => {
        return new promise((resolve,reject) => {
            crypto.randomBytes(16,(err,buf) => {
                if(err)
                {
                    console.log(err);
                    return reject(err)
                }
                const  filename = buf.toString('hex')  + path.extname(file.originalname);
                const fileDetails = {
                    filename : filename,
                    bucketName : "uploads"
                };
                resolve(fileDetails)
            } )
        } ) 
    } 
})

const upload = multer({storage});
router.get('/',(req,res) => {
    
   // res.render("../views/upload", {titleHead : "Lets Upload Files"} );

    if(!gfg)
    {
        res.send("Error occured to connect to DB")
        process.exit(0);
    }
    gfg.find().toArray((err,files) => {
        if(!files || files.length === 0 )
        {
            res.render('../views/upload.ejs', {files : false})
        }
        else
        {
            const checkFile = files
                .map(file => {
                if(file.contentType === 'image/png' || file.contentType === "image/jpeg" )
                {
                    file.isImage = true
                }
                else
                {
                    file.isImage = false
                }
                return file
                } )
               

            return res.render('../views/upload.ejs ', {
                files : checkFile,
                 titleHead : "Lets Upload Files"
              } )
        }
    } )
  
} );


router.post('/uploadedFiles',upload.single('file'), (req,res) => {
   res.redirect('/')
} )

// router.get('/image/:filename', (req,res) => {
//     const file = gfg.find({filename : req.params.filename} )
//                     .toArray((err,files) => {
//                         if(!files || files.length === 0 )
//                         {
//                           return res.status(404).json({
//                                 err : "No such file exist"
//                             })
//                         }
//                         gfg.openDownloadStreamByName(req.params.filename).pipe(res);
//                     } )
//      } )
// router.post('/file/del/:id', (err,res) => {
//     gfg.delete(mongoose.Types.ObjectId(req.params.id), (err,res) => {
//         if(err)
//         {
//             res.status(404).json({
//                 err : err.message
//             })
//         }
//         else
//         {
//             res.status(200).send("File Deleted")
//         }
//     } )
// } )

module.exports = router;

