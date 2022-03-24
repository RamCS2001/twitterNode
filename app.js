const express= require('express');
// const mongoose = require('mongoose');
const app=express();
const PORT = process.env.PORT || 5000;
const MongoClient = require("mongodb").MongoClient;


//DB connection -- local
const url='mongodb://localhost:27017/';
var dbo;
var db;
MongoClient.connect(url,function(err,db){
    if (err) throw err;
    console.log("Database Connected!");
    dbo = db.db("twitterclone");
});

// const connectionParams ={
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true
// }

// const uri= 'mongodb+srv://twitterclone:Qwertyuiop@cluster0.y3w2o.mongodb.net/twitterclone?retryWrites=true&w=majority'
// const connection= mongoose.connect(uri).then(()=> console.log("Database Connected"))
// .catch((err)=> console.log(err));


var username ;
app.get('/logincheck',(req,res)=>{
  res.setHeader("Access-Control-Allow-Origin","*");
	var a = req.query["username"];
    username=a;
    var b = req.query["password"];
    //sql var q="select password from user where username='"+a+"';";
    var q={username: a, password: b};
    dbo.collection("user").findOne(q, (err, result)=> {
        if (err) throw err;
        if(!result){
            console.log("Login unsuccessful");
            res.json({message: false});
            return;
        }
        else
            console.log("Login successful");
            res.json({message: true, username: a});

            return;

    });
});

app.get('/getaccounts',(req,res) =>{
    res.setHeader("Access-Control-Allow-Origin","*");
    console.log("get all users");
    dbo.collection("user").find({}).toArray((err, result)=> {
        if(err) throw err
        var nrows=result.length;
        var jsondata=[];
        for(var i=0;i<nrows;i++){
            row=result[i];
            console.log(row);
            jsondata.push(row);
        } 
        res.json({jsondata});   
    });
});
app.get('/getTweets',(req,res) =>{
    res.setHeader("Access-Control-Allow-Origin","*");
    console.log("get all tweets");
    dbo.collection("tweets").find({}).sort({date: -1}).toArray((err, result)=> {
        if(err) throw err
        var nrows=result.length;
        var jsondata=[];
        for(var i=0;i<nrows;i++){
            row=result[i];
            console.log(row);
            jsondata.push(row);
        } 
        res.json({jsondata});   
    });
});
app.get('/insertUSer',(req,res)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    var a = req.query["username"];
    var b = req.query["password"];
    //sql var q="select password from user where username='"+a+"';";
    var q={username: a, password: b};
    dbo.collection("user").insertOne(q,(err,result)=>{
        if(err) throw err;
        console.log("data inserted");
        res.json({message: true}); 
    });
});
app.get('/username',(req,res)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.json({username: username});
});


app.get('/dashboard',(req,res)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
});
app.get('/tweet',(req,res)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    var a = req.query["username"];
    var b = req.query["tweet"];
    var c=new Date();
    var q={username: a, tweet: b,date: c};
    dbo.collection("tweets").insertOne(q,(err,result)=>{
        if(err) throw err;
        console.log("data inserted");
        res.json({message: true}); 
    });
});
   
app.get('/sample',(req,res)=>{
    res.send("Hey! server here from sample");
});
app.get('/',(req,res)=>{
    res.send("Hey!");
});

app.listen(PORT,"0.0.0.0"); 
console.log("Server@PORT||5000");