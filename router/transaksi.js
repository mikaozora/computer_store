const {
    urlencoded
} = require("express")
const express = require("express")
const multer = require("multer")
const models = require("../models/index")
const transaksi = models.transaksi
const detail_transaksi = models.detail_transaksi
const app = express()
app.use(express.urlencoded({
    extended: true
}))

app.get("/", async (req, res) => {
    let data = await transaksi.findAll({
        include: [
            "customer",
            {
                model: models.detail_transaksi,
                as: "detail_transaksi",
                include: ["product"]
            }
        ]
    })
    res.json({
        data: data
    })
})
app.get("/:transaksi_id", async (req, res) => {
    let param = {
        transaksi_id: req.params.transaksi_id
    }
    let data = await transaksi.findOne({
        where: param,
        include: [
            "customer",
            {
                model: models.detail_transaksi,
                as: "detail_transaksi",
                include: ["product"]
            }
        ]

    })
    res.json({
        data: data
    })
})
app.post("/", async (req, res) => {
    let data = {
        customer_id: req.body.customer_id,
        waktu: req.body.waktu
    }
    transaksi.create(data)
        .then(result => {
            //ambil nilai
            let transaksi_id = result.transaksi_id
            let detail = JSON.parse(req.body.detail_transaksi)

            // awal dari array detail
            // detail = [
            //     {"product_id": "1","qty" : "1", "price":"10000"}, // elemen 1 sisipkan transaksi_id = "5"
            //     {"product_id": "2","qty" : "5", "price":"5000"} // elemen 2, sisipkan transaksi_id ="5"
            // ]

            //proses menyisipkan transaksi_id
            detail.forEach(element => {
                element.transaksi_id = transaksi_id
            });
            // akhir dari array detail
            // detail = [
            //     {"transaksi_id": "5","product_id": "1","qty" : "1", "price":"10000"}, // elemen 1 sisipkan transaksi_id = "5"
            //     {"transaksi_id": "5","product_id": "2","qty" : "5", "price":"5000"} // elemen 2, sisipkan transaksi_id ="5"
            // ]

            // proses insert data ke detail_transaksi
            // create -> dibuat utk insert 1 data / row
            // bulkCreate-> dibuat utk insert multiple data/row
            detail_transaksi.bulkCreate(detail)
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
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

app.put("/", async (req, res) => {
    //update
    let data = {
        customer_id: req.body.customer_id,
        waktu: req.body.waktu
    }
    let param = {
        transaksi_id: req.body.transaksi_id
    }
    //proses insert data
    transaksi.update(data, {
            where: param
        })
        .then(result => {
            //hapus data
            detail_transaksi.destroy({
                where: param
            }).then().catch()
            //ambil niai dari transaksi
            let transaksi_id = param.transaksi_id
            let detail = JSON.parse(req.body.detail_transaksi)

            // awal dari array detail
            // detail = [
            //     {"product_id": "1","qty" : "1", "price":"10000"}, // elemen 1 sisipkan transaksi_id = "5"
            //     {"product_id": "2","qty" : "5", "price":"5000"} // elemen 2, sisipkan transaksi_id ="5"
            // ]

            detail.forEach(element => {
                element.transaksi_id = transaksi_id
            });
            // akhir dari array detail
            // detail = [
            //     {"transaksi_id": "5","product_id": "1","qty" : "1", "price":"10000"}, // elemen 1 sisipkan transaksi_id = "5"
            //     {"transaksi_id": "5","product_id": "2","qty" : "5", "price":"5000"} // elemen 2, sisipkan transaksi_id ="5"
            // ]

            detail_transaksi.bulkCreate(detail)
                .then(result => {
                    res.json({
                        message: "data has been updated"
                    })
                })
                .catch(error => {
                    res.json({
                        message: error.message
                    })
                })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})
app.delete("/:transaksi_id", async (req, res) => {
    let param = {
        transaksi_id: req.params.transaksi_id
    }
    try {
        // hapus detail
        await detail_transaksi.destroy({
            where: param
        })

        // hapus transaksi
        await transaksi.destroy({
            where: param
        })
        res.json({
            message: "data has been deleted"
        })
    } catch (error) {
        res.json({
            message: error.message
        })
    }
})
module.exports = app