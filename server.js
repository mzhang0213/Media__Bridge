const express = require('express');
const multer = require('multer');
const fs = require("fs");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname+/uploads/);
    },
    filename: function (req, file, cb) {
        var uniqueName = (Date.now() + Math.round(Math.random() * 1E13)).toString();
        
        if (req.body.changes!==""){
            var changes = JSON.parse(req.body.changes)
            for (var i=0;i<Object.values(changes);i++){
                if (Object.keys(changes)[i]===file.originalname){
                    uniqueName = Object.values(changes)[i]
                }
            }
        }
        uniqueName = uniqueName.substring(uniqueName.length-10,uniqueName.length) + "."+ file.mimetype.substring(file.mimetype.indexOf("/")+1).toLowerCase();
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
    upload.fields([{name:"photos"},{name:"videos"},{name:"changes"}])(req, res, (multerErr)=>{
    if (multerErr){
      console.log("reeeeeeee" + multerErr);
    } else {
      res.redirect("/download");
    }
})  });

app.get("/getFiles", (req, res)=>{
    var json = {
        files:""
    }
    json.files = fs.readdirSync("./uploads");
    console.log(json);
    res.send(JSON.stringify(json));
})

app.get("/uploads/*", (req, res)=>{
    res.sendFile(__dirname+req.url.substring(req.url.indexOf("/uploads/")));
});

app.get("/favicon.ico", (req,res)=>{
    res.sendFile(__dirname+"/favicon.ico");
})

app.listen(PORT, () => {
    console.log('Listening at ' + PORT + "ee e ee e e e");
});
