var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var cors = require('cors')
app.use(bodyParser.json())
app.use(cors())

const getMark = require("./getMark.js");

app.post("/sendUserData", function (req, res) { // запрос ответ
    console.log(req.body)
    res.send(req.body)
    getMark.getMark(req.body);
})

app.listen(5000, function () {
    console.log("PORT 5000!")
})  