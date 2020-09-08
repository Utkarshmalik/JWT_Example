require('dotenv').config()
const express= require("express");
const app=express()
const bodyParser=require('body-parser');
const cors=require('cors');
const path=require("path");
var jwt = require('jsonwebtoken');
app.use(cors())
app.use(bodyParser.json())
app.set('view engine', 'ejs');

var multer  = require('multer')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname + '-' + Date.now()+path.extname(file.originalname))
    }
  })

  function fileFilter (req, file, cb) {    
    // Allowed ext
     const filetypes = /jpeg|jpg|png|gif/;
  
   // Check ext
    const extname =  filetypes.test(path.extname(file.originalname).toLowerCase());
   // Check mime
   const mimetype = filetypes.test(file.mimetype);
  
   if(mimetype && extname){
       return cb(null,true);
   } else {
       cb('Error: Images Only!');
   }
  }

  var upload = multer({ storage: storage ,limits:{
    fileSize:1000000
  }, fileFilter })

// var upload=multer({dest:'uploads/'})


app.post('/upload',upload.single('product_pic'),(req,res)=>
{

     console.log(req.file);
    // console.log(req.body);
    res.send("Hello");

    const  Product=new Schema({
     id:req.body.id,
     title:req.body.titile,
      productImage:req.file.path
    })

    Product.save()

});



app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'ejs');

app.get('/',(req,res)=>
{
    res.render("home",{name:"Utkarsh",data:"SOME DATA COMING FROM MY DATABASE"});
})

const userComments=[{
    name:"Utkarsh",
    comments:"Data Level-1"
},{
    name:"Rahul",
    comments:"Data Level-2"
}]

app.post('/login',(req,res)=>
{
    //Authentication

    //User is Authenticated over here
    
    console.log(req.body);
    const user={name:req.body.userName}
    console.log(user);
   const accessToken=jwt.sign(user,process.env.access_secret_key);
    res.send({accessToken});
})


app.get('/comments',authenticateToken,(req,res)=>
{

    res.send( userComments.filter(user =>  user.name===req.user.name));
})

function authenticateToken(req,res,next)
{

    const authHeader=req.headers['authorization'];
    const jwtToken= authHeader && authHeader.split(' ')[1];

    if(jwtToken==null)
     res.sendStatus(401);

     jwt.verify(jwtToken,process.env.access_secret_key,(err,user)=>
    {
        if(err)
        return res.sendStatus(403);

        req.user=user;
        console.log(user)
        next();
    });

}





app.listen(8000,()=>{
    console.log("Server-2 listening on port 8000");
});
