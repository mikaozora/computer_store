const express = require("express")
const app = express()
const md5 = require("md5")

//call model
const models = require("../models/index")
const admin = models.admin

//menyisipkan proses validasi token untuk keamanan
const valdateToken = require("./auth/validateToken")
app.use(valdateToken)
app.use(express.urlencoded({extended:true}))

app.get("/", (req, res) => {
    admin.findAll()
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

app.get("/:id", (req, res) => {
    let param = {
        id: req.params.id
    }
    admin.findOne({where:param})
    .then(result => {
        res.json({
            data: result
        })
    })
    .catch(error => {
        res.json({
            message : error.message
        })
    })
})

app.post("/", (req, res) => {
    let data = {
        name: req.body.name,
        username: req.body.username,
        password: md5(req.body.password)
    }
    admin.create(data)
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
})
app.put("/", async(req, res) => {
    let param = {
        id: req.body.id
    }
    let data = {
        name : req.body.name,
        username : req.body.username,
        password : md5(req.body.password)
    }
    admin.update(data, {where:param})
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
app.delete("/:id", async(req, res) => {
    try{
        let param = {
            id : req.params.id
        }
        admin.destroy({where:param})
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
    } catch (error) {
        res.json({
            message : error.message
        })
    }
})
module.exports = app