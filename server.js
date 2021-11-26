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

app.post('/uploading', (req, res) => {
    upload.fields([{name:"photos"},{name:"videos"},{name:"any"}])(req, res, (multerErr)=>{
    if (multerErr){
    } else {
        var files = fs.readdirSync("./uploads/");
        var changes = req.body.changes===""?"":JSON.parse(req.body.changes);
        for (var a=0;a<files.length;a++){
            var index = -1;
            var b=0;
            do{
                if((changes!=="")&&files[a].substring(8)===changes[b].originalName){
                    index=b;
                }
                b++;
            }while(b<changes.length);

            if (files[a].indexOf("tempfile")===0){
                console.log(files[a]);
                if (index!==-1){
                    console.log("rename, " + index);
                    //means that this is a file in the tree that needs its name changed
                    try{
                        fs.renameSync(__dirname+"/uploads/"+files[a], __dirname+"/uploads/"+changes[index].name);
                    }catch (rE){
                        console.log("rename err: " + rE);
                    }
                } else {
                    //file needs a random name
                    var uniqueName = uniqueName.substring(uniqueName.length-10,uniqueName.length) + file.originalname.substring(file.originalname.length-4,file.originalname.length);
                    uniqueName+=files[a].substring(files[a].indexOf("."));
                    try{
                        fs.renameSync(__dirname+"/uploads/"+files[a], __dirname+"/uploads/"+uniqueName);
                    }catch (rE){
                        console.log("rename err: " + rE);
                    }
                }
            }
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
