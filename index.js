const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const route = require("./routes/route.js")
const app = express();
const multer = require("multer")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(multer().any())

mongoose.connect("mongodb+srv://priyanka:PriyankaRajput@cluster0.fhqcn.mongodb.net/BooksManagement?retryWrites=true&w=majority",
{useNewUrlparser:true})
.then(()=>console.log("MongoDb is connected"))
.catch(err =>console.log(err))

app.use('/',route);

app.listen(process.env.PORT ||3000,function(){
    console.log("Express is running on port ",+(process.env.Port || 3000))

});