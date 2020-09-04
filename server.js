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

let refreshTokens=[]

app.post('/login',(req,res)=>
{
    //Authentication

    //User is Authenticated over here
    
    console.log(req.body);
    const user={name:req.body.userName}
    console.log(user);
   const accessToken=accessTokenGenerator(user);
   const refreshToken=jwt.sign(user,process.env.refresh_secret_key);
   refreshTokens.push(refreshToken);
    res.send({accessToken,refreshToken});
})

app.post('/refresh',(req,res)=>
{
    const refreshToken=req.body.refreshToken;

    if(refreshToken==null)
    res.sendStatus(401);

    //the token that is provided by user , is present with me or not

    if(!refreshTokens.includes(refreshToken))
    res.sendStatus(403);

    jwt.verify(refreshToken,process.env.refresh_secret_key,(err,user)=>
    {
    if(err)
    res.sendStatus(403)
    const accessToken=accessTokenGenerator({name:user.name});
    res.json({accessToken});
   })
})

app.post('/logout',(req,res)=>
{
    const refreshToken=req.body.refreshToken;
    refreshTokens=refreshTokens.filter(token=>token!=refreshToken);

    res.send({logout:true})
})

function accessTokenGenerator(user) {
    return jwt.sign(user,process.env.access_secret_key,{expiresIn:"35s"});
}


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





app.listen(3000,()=>
{
    console.log("Server-1 listening on port 3000");

});
