const express = require("express")
const multer = require("multer")
const app = express()

//panggil model
const models = require("../models/index")
const product = models.product
const path = require("path")
const fs = require("fs")


//config multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./image")
    },
    filename: (req, file, cb) => {
        cb(null, "img-" + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({storage: storage})

app.get("/", (req, res) => {
    // ambil data
    product.findAll()
    .then(result => {
        res.json({
            data : result
        })
    })
    .catch(error => {
        res.json({
            message : error.message
        })
    })
})
app.get("/:product_id", (req,res) => {

    // ambil data by id
    let param = {
        product_id: req.params.product_id
    }
    product.findOne({where: param})
    .then(result =>{
        res.json({
            data: result
        })
    })
    .catch(error => {
        res.json({
            message: error.message 
        })
    })
})
app.post("/", upload.single("image"), (req, res) => {
    if (!req.file){
        res.json({
            message : "no uploaded file"
        })
    }else{
        let data = {
            name : req.body.name,
            price : req.body.price,
            stock : req.body.stock,
            image : req.file.filename
        }
        //insert data
        product.create(data)
        .then(result => {
            res.json({
                message : "data berhasil ditambahkan"
            })
        })
        .catch(error => {
            res.json({
                message : error.message
            })
        })
    }
})
app.put("/", upload.single("image"), async(req, res) => {
    //update data
    let param = {
        product_id: req.body.product_id
    }
    let data = {
        name : req.body.name,
        price : req.body.price,
        stock : req.body. stock
    }
    if(req.file){
        //get data by id
        const row = await product.findOne({where: param})
        let oldFileName = row.image

        //delete old file
        let dir = path.join(__dirname, "../image", oldFileName)
        fs.unlink(dir, err => console.log(err))

        // set new filename
        data.image = req.file.filename
    }
    product.update(data, {where: param})
    .then(result => {
        res.json({
            message : "data berhasil diupdate"
        })
    })
    .catch(error => {
        res.json({
            message : error.message
        })
    })
})
app.delete("/:product_id", async(req, res) => {
    try{
        let param = {
            product_id : req.params.product_id
        }
        let result = await product.findOne({where : param})
        let oldFileName = result.image

        //delete
        product.destroy({where:param})
        .then(result => {
            res.json({
                message : "data berhasil dihapus"
            })
        })
        .catch(error => {
            res.json({
                message : error.message
            })
        })
    } catch(error){
        res.json({
            message : error.message
        })
    }
})
module.exports = app