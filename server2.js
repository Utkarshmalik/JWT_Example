require('dotenv').config()
const express= require("express");
const app=express()
const bodyParser=require('body-parser');
const cors=require('cors');
var jwt = require('jsonwebtoken');
app.use(cors())
app.use(bodyParser.json())


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
