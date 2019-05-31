var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var cors = require('cors')
app.use(bodyParser.json())
app.use(cors())

const getMark = require("./getMarkNew.js");

app.post("/sendUserData", async function (req, res) { // запрос ответ
    console.log(req.body)
    let masMark = await getMark.getMark(req.body);
    res.send(masMark)
})

app.listen(5000, function () {
    console.log("PORT 5000!")
})  