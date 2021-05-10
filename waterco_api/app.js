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
    password:String,
    role:String
}
const User = mongoose.model("User",userSchema);

//ADD A USER/ sign up
app.post("/users/signup",function(req,res){
    //new user object
    const newUser = new User({
        email: req.body.email,
        password: req.body.password,
        role:req.body.role
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

//get all users
app.get("/users/all",function(req,res){
    User.find(function(err,usersFound){
        if (!err) {
            console.log("no error");
            res.send(usersFound);
        }else{
            res.send(err);
        }
    });
});

//request a specific user
app.route("/users/find/:user_email")
.get(function(req,res){
    
 User.findOne({email:req.params.user_email},function(err,foundUser){
        if(foundUser){
            res.send(foundUser);
        }else{
            res.send("No user found with that email.")
        }
    })
})



// CLIENTS ////////////////////////////////////////////
//clientSchema
const clientSchema= {
    email:String,
    name: String
}
const Client = mongoose.model("Client",clientSchema);

//add a new client
app.post("/clients/new",function(req,res){
    const newClient = new Client({
        email:req.body.email,
        name:req.body.name,
    });
    newClient.save(function(err){
        if (!err) {
            res.send("Successfuly registered New Client");
        } else {
            res.send(err);
        }
    });
});

//request a client record
app.route("article/find:clientEmail")
.get(function(req,res){
    Client.findOne({email:req.params.clientEmail},function(err,founfClient){
        if(founfClient){
            res.send(founfClient)
        }else{
            res.send("No client found with that email")
        }
    })
})

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


// PREMISES //////////////////////////////////////////////////////////
//premiseSchema
const premiseSchema = {
    address:String,
    premiseNo: String,
    clientEmail:String
};
const Premise = mongoose.model("Premise",premiseSchema);

//add new premise
app.post("/premises/new",function(req,res){
    const newPremise = new Premise({
        address:req.body.address,
        premiseNo:req.body.premiseNo,
        clientEmail:req.body.clientEmail
    });
    newPremise.save(function(err){
        if (!err) {
            res.send("Successfuly registered new Premise");
        } else {
            
        }
    });
});

//get all premises
app.get("/premises/all",function(req,res){
    Premise.find(function(err,foundPremises){
        if (!err) {
            res.send(foundPremises);
        }else(err);
    });
});
 

// BILLS ///////////////////////////////////////////////////
//billSchema
const billSchema={
    units:Number,
    unitPrice:Number,
    totalBill:Number,
    premiseNo:String
    
};
const Bill = mongoose.model("Bill",billSchema);
//get all bills
app.get("/bills/all",function(err,foundBills){
    Bill.find(function(err,foundBills){
        if (!err) {
            res.send(foundBills);
        } else {
            res.send(err);
        }
    });
});
//create a new bill
app.post("/bills/new",function(req,res){
    const newBill = new Bill({
        units:req.body.units,
        unitPrice:req.body.unitPrice,
        totalBill: units*unitPrice,
        premiseNo:req.body.premiseNo
    });
    newBill.save(function(err){
        if (!err) {
            res.send("Successfuly created new bill");
        } else {
            res.send(err);
        }
    })
})


//Payments/////////////////////////////////////////////////////////
//paymentSchema
const paymentSchema={
    premiseNo:Number,
    totalBill:Number,
    paidAmount:Number
}
const Payment=mongoose.model("Payment",paymentSchema);

//create new bill
app.post("/payments/new",function(req,res){
    const newPayment = new Payment({
        premiseNo: req.body.premiseNo,
        totalBill: req.body.totalBill,
        paidAmount: req.paidAmount
    });
    newPayment.save(function(err){
        if (!err) {
            res.send("Successfulty created new bill.");
        } else {
            res.send(err);
        }
    })
})

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