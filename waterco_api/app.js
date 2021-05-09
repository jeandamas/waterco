//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();
//templating engine
app.set('view engine', 'ejs');

//to pass requests
app.use(bodyParser.urlencoded({
    extended:true
}));

//public directory to store static files eg: css
app.use(express.static("public"));

//setting up mongoose
mongoose.connect("mongodb://localhost:27017/waterco_db",{useNewUrlParser:true,useUnifiedTopology: true});


///////////////////////////////
// DATABASE API INTERACTIONS //
//////////////////////////////

//  USERS  /////////////////////////////////////////////////////////////////////
//userSchema
const userSchema = {
    email:String,
    password:String
}
const User = mongoose.model("User",userSchema);

//get all users
app.get("/users/all",function(req,res){
    User.find(function(err,usersFound){
        if (!err) {
            console.log("no error");
            res.send(usersFound)
        }else{
            res.send(err)
        }
    });
});

//ADD A USER
app.post("/users/signup",function(req,res){
    //console.log is for testing purpose to see inputed info
    console.log(req.body.email);
    console.log(req.body.password);
    //new user object
    const newUser = new User({
        email: req.body.email,
        password: req.body.password
    });
    //save new user to the mongodb database
    newUser.save(function(err){
        if(!err){
            console.log("no error");
            res.send("Successfuly registered New User");
        }else{
            res.send(err);
            console.log("there was an error");
        }  
    });
});


// CLIENTS ////////////////////////////////////////////
//clientSchema
const clientSchema= {
    name: String,
    premiseNo:String
}
const Client = mongoose.model("Client",clientSchema);
//get all clients
app.get("/clients/all",function(req,res){
    Client.find(function(err,foundClients){
        if (!err) {
            res.send(foundClients);
        }else{
            res.send(err);
        }
    });
});

//add a new client
app.post("/clients/new",function(req,res){
    const newClient = new Client({
        name:req.body.name,
        premiseNo:req.body.premiseNo
    });
    newClient.save(function(err){
        if (!err) {
            res.send("Successfuly registered New Client");
        } else {
            res.send(err)
        }
    })
})

// PREMISES /////////////////////////////////////////////////
//premiseSchema
const premiseSchema = {
    district:String,
    sector:String,
    premiseNo:String
};
const Premise = mongoose.model("Premise",premiseSchema);
//get all premises
app.get("/premises/all",function(req,res){
    Premise.find(function(err,foundPremises){
        if (!err) {
            res.send(foundPremises);
        }else(err);
    });
});
 
//add new premise
app.post("/premises/new",function(req,res){
    const newPremise = new Premise({
        district:req.body.district,
        sector:req.body.sector,
        premiseNo:req.body.premiseNo
    });
    newPremise.save(function(err){
        if (!err) {
            res.send("Successfuly registered new Premise");
        } else {
            
        }
    })
})

// BILLS ////////////////////////////////////////////
//billSchema
const billSchema={
    premiseNo:String,
    date:Date,
    unitPrice:Number,
    units:Number,
    totalBill:Number,
};
const Bill = mongoose.model("Bill",billSchema);
//get all payments
app.get("/bills/all",function(err,foundBills){
    Bill.find(function(err,foundBills){
        if (!err) {
            res.send(foundBills);
        } else {
            res.send(err);
        }
    });
});

app.post("/bills/new",function(req,res){
    const newBill = new Bill({
        premiseNo:req.body.premiseNo,
        date:req.body.date,
        unitPrice:req.body.unitPrice,
        units:req.body.units,
        totalBill:req.body.totalBill,
    });
    newBill.save(function(err){
        if (!err) {
            res.send("Successfuly created new bill");
        } else {
            res.send(err);
        }
    })
})


//Payments////////////////////////////////////////////
//paymentSchema
const paymentSchema={
    bill_ID:String,
    premiseNo:Number,
    totalBill:Number,
    paidAmount:Number
}
const Payment=mongoose.model("Payment",paymentSchema);
//get all payments
app.get("/payments/all",function(req,res){
    Payment.find(function(err,foundPayments){
        if (!err) {
            res.send(foundPayments);
        } else {
            res(err);
        }
    });
});





// SERVER LISTENING PORT
app.listen(3000,function(){
    console.log("Server started on port 3000");
});