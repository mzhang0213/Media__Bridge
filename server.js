const express = require('express');
const multer = require('multer');
const fs = require("fs");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname+/uploads/);
    },
    filename: function (req, file, cb) {
        var uniqueName = (Date.now() + Math.round(Math.random() * 1E13)).toString();
        /*
        if(Object.keys(req.body).length!==0){
            //see if current file has a rename
            for (var i=0;i<Object.value(req.body).length)
        }
        req.body*/
        uniqueName = uniqueName.substring(uniqueName.length-10,uniqueName.length) + "."+ ile.mimetype.substring(file.mimetype.indexOf("/")+1).toLowerCase();
        cb(null, uniqueName);
    }
});

const upload = multer({ storage: storage });

const app = express();
const PORT = process.env.PORT || 12232;

app.use(express.static('public'));

var pos = 0;
const specialChars = "!@#$%^&*()-=_+[]{}|;':\".,<>/\?`~\\";
function isNoSpChar(str) {
    for (var i = 0; i < str.length; i++) {
        if (specialChars.indexOf(str.charAt(i)) !== -1) {
            return false;
        }
    }
    return true;
}

app.post('/uploading', (req, res) => {
    upload.fields([{name:"photos"},{name:"videos"}])(req, res, (multerErr)=>{
    /*
    var reqfiles = [];
    if (multerErr){
        console.log("bad name w/ files");
        res.redirect("/?badName=true");
    } else {
    if (Object.keys(req.files).length!==0){
        console.log("files and/or req.body have appeared");
        for (var rfi=0;rfi<Object.keys(req.files).length;rfi++){
            var objArr = Object.values(req.files)[rfi];
            for (var ind=0;ind<objArr.length;ind++){
                reqfiles.push(objArr[ind]);
            }
        }
        if (req.body.imageName.length!==0){
            if (validName){
                console.log("looking good so far; all fields filled out & cover video present")
                var dir = "/uploads/";
                validName = false;
                res.redirect(redir);
            } else {
                //bad name
                console.log("bad name");
                res.redirect("/?badName=true");
            }
        } else {
        }
        if (req.body.videoName.length!=0){
            if (validName){

            }
        }
    //no files
    } else { //nothing submitted or bad name
        console.log("nothing uploaded idiot");
        validName = false;
        res.redirect("/?badName=true");
    }
}  */})  });

app.get("/favicon.ico", (req,res)=>{
    res.sendFile(__dirname+"/favicon.ico");
})

app.listen(PORT, () => {
    console.log('Listening at ' + PORT + "ee e ee e e e");
});