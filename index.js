const express = require("express")
const app = express()
const port = 3000
const path = require("path")
var favicon = require('serve-favicon');

app.use(express.static('public'))

app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/index.html"))
})

app.listen(port, () => {
    console.log(`Operacao coelho runnin in ${port}`)
})
