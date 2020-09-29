const express = require("express")
const auth = express()
const md5 = require("md5")
//import model admin
const models = require("../../models/index")
const admin = models.admin

//call jwt
const jwt = require("jsonwebtoken")
const SECRET_KEY = "mokleters"

auth.use(express.urlencoded({extended:true}))
auth.post("/", async(req, res) => {
    let data = {
        username : req.body.username,
        password : md5(req.body.password)
    }
    //cek data
    let result = await admin.findOne({where:data})
    if(result){
        let payload = JSON.stringify(result)
        // payload adalah data yang akan dienkripsi menggunakan jwt
        return res.json({
            data : result,
            token : jwt.sign(payload, SECRET_KEY) //proses generate token
        })
    }
    return res.json({
        message : "invalid username or password"
    })
})
module.exports = auth