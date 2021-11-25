var multer = require("multer");
var express = require("express");
var app = express();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname+"/uploads/");
    },
    filename: function (req, file, cb) {
        var uniqueName = (Date.now() + Math.round(Math.random() * 1E13)).toString();
        cb(null, uniqueName);
    }
});

const upload = multer({ storage: storage });

app.post('/stats', function (req, res) {
   // req.file is the name of your file in the form above, here 'uploaded_file'
   // req.body will hold the text fields, if there were any
   upload.fields([{name:'uploaded_file'},{name:"nspeakers"}])(req,res,(err)=>{
	   if (err){
		   console.log(err);
	   }else{
		   console.log(req.files, req.body)
	   }
   })
});

app.use(express.static("test"));
app.listen("12232", ()=>{
	console.log("listening");
})