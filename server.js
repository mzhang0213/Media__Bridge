const express = require('express');
const multer = require('multer');
const fs = require("fs");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname+"/uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, "tempfile"+file.originalname);
    }
});

const upload = multer({ storage: storage });

const app = express();
const PORT = process.env.PORT || 12232;

app.use(express.static('public'));

var pos = 0;
const specialChars = "!@#$%^&*=+[]{}|;':\",.<>/\?`~\\";
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
    if (multerErr){
    } else {
        var files = fs.readdirSync("./uploads/");
        var changes = req.body.changes===""?"":JSON.parse(req.body.changes);
        for (var a=0;a<files.length;a++){
            var b=0;
            do{
                if((changes!=="")&&files[a].substring(8)===changes[b].originalName&&files[a].indexOf("tempfile")==0){
                    //means that this is a file in the tree that needs its name changed
                    try{
                        fs.renameSync(__dirname+"/uploads/"+files[a], __dirname+"/uploads/"+changes[b].name);
                    }catch (rE){
                        console.log("rename err: " + rE);
                    }
                } else if (files[a].indexOf("tempfile")===0){
                    //file needs a random name
                    var uniqueName = (Date.now() + Math.round(Math.random() * 1E13)).toString();
                    uniqueName+=files[a].substring(files[a].indexOf("."));
                    try{
                        fs.renameSync(__dirname+"/uploads/"+files[a], __dirname+"/uploads/"+uniqueName);
                    }catch (rE){
                        console.log("rename err: " + rE);
                    }
                }
                b++;
            }while(b<changes.length);
        }
        res.redirect("/download");
    }
})  });

app.get("/getFiles", (req, res)=>{
    var json = {
        files:""
    }
    json.files = fs.readdirSync("./uploads");
    res.send(JSON.stringify(json));
})

app.post("/destroy", upload.none(), (req,res)=>{
  //file: req.body.fileName
  try {
    fs.unlinkSync(__dirname+"/uploads/"+req.body.fileName);
  } catch(e) {
    console.log("awejfiowj file del err: " + e);
    res.redirect("./download/?destroy=fail");
  }
  res.redirect("./download/?destroy=true");
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
