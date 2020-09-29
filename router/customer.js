const express = require("express")
const multer = require("multer")
const app = express()

//panggil model
const models = require("../models/index")
const customer = models.customer
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
const upload = multer({
    storage: storage
})

app.get("/", (req, res) => {
    //ambil data
    customer.findAll()
        .then(result => {
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
app.get("/:customer_id", (req, res) => {
    let param = {
        customer_id: req.params.customer_id
    }
    customer.findOne({
            where: param
        })
        .then(result => {
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
    if (!req.file) {
        res.json({
            message: "no upload file"
        })
    } else {
        let data = {
            name: req.body.name,
            phone: req.body.phone,
            address: req.body.address,
            image: req.file.filename
        }
        //insert data
        customer.create(data)
            .then(result => {
                res.json({
                    message: "data berhasil ditambahkan"
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    }
})
app.put("/", upload.single("image"), async (req, res) => {
    //update data
    let param = {
        customer_id: req.body.customer_id
    }
    let data = {
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address
    }
    if (req.file) {
        //get data by id
        const row = await customer.findOne({
            where: param
        })
        let oldFileName = row.image

        //delete old file
        let dir = path.join(__dirname, "../image", oldFileName)
        fs.unlink(dir, err => console.log(err))

        //set filename
        data.image = req.file.filename
    }
    customer.update(data, {
            where: param
        })
        .then(result => {
            res.json({
                message: "data berhasil diupdate"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})
app.delete("/:customer_id", async (req, res) => {
    try {
        let param = {
            customer_id: req.params.customer_id
        }
        let result = await customer.findOne({
            where: param
        })
        let oldFileName = result.image

        customer.destroy({
                where: param
            })
            .then(result => {
                res.json({
                    message: "data berhasil dihapus"
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    } catch (error) {
        res.json({
            message: error.message
        })
    }
})
module.exports = app