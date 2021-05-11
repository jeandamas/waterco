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
app.get("/users/find/:userEmail",function(req,res){
    
 User.findOne({email:req.params.userEmail},function(err,foundUser){
        if(foundUser){
            res.send(foundUser);
        }else{
            res.send("No user found with that email.");
        }
    });
});
//update the user
app.put("/users/update/:userEmail",function(req,res){
    User.update(
        {email:req.params.userEmail},
        {email:req.body.email, password:req.body.password},
        {overwrite:true},
        function(err){
            if (!err) {
                res.send("User updated successfully");
            } else {
                res.send("error");
            }
        }
    );
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
app.route("/clients/find/:clientEmail")
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

//update client
app.put("/clients/update/:clientEmail",function(req,res){
    User.update(
        {email:req.params.clientEmail},
        {email:req.body.email,password:req.body.password},
        {overwrite:true},
        function(err){
            if (!err) {
                res.send("Successfuly updated client information")
            } else {
                res.send(err);
            }
        }
    );
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
 
//get a client premise
app.route("/premises/find/:clientEmail")
.get(function(req,res){
    Premise.findOne({clientEmail:req.params.clientEmail},function(err,foundPremise){
        if (foundPremise) {
            res.send(foundPremise)
        } else {
            res.send("No premise with the client email you entered");
        }
    });
})

//update a premise
app.get("/premises/update/:premiseNumber",function(req,res){
    Premise.updateOne(
        {premiseNo:req.params.premiseNumber},
        {address:req.body,premiseNo:req.body.premiseNo,clientEmail:req.body.clientEmail},
        {overwrite:true}
    ),function(err){
        if (!err) {
            res.send("Successfuly updated premise");
        } else {
            res.send(err);
        }
    }
})

//View Premise
app.route("/premises/:premiseNumber")
.get(function(req,res){
    Premise.findOne({clientEmail:req.params.clientEmail},function(err,foundPremise){
        if (foundPremise) {
            res.send(foundPremise)
        } else {
            res.send("No premise with the client email you entered");
        }
    });
})

// BILLS ///////////////////////////////////////////////////
//billSchema
const billSchema={
    billNumber:String,
    units:Number,
    unitPrice:Number,
    totalPrice:Number,
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
        billNumber:req.body.billNumber,
        units:req.body.units,
        unitPrice:req.body.unitPrice,
        totalPrice: units*unitPrice,
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
//view bill by bill number
app.get("/bills/:theBillNumber",function(req,res){
    Bill.findOne(
        {billNumber:req.params.theBillNumber},
        function(err,foundBills){
            if (foundBills) {
                res.send(foundBills)
            } else {
                res.send("No bill match the number entered")
            }
        }
    )
})



//Payments/////////////////////////////////////////////////////////
//paymentSchema
const paymentSchema={
    premiseNo:Number,
    totalPrice:Number,
    paidAmount:Number,
}
const Payment=mongoose.model("Payment",paymentSchema);

//create new payment
app.post("/payments/new",function(req,res){
    const newPayment = new Payment({
        premiseNo: req.body.premiseNo,
        totalPrice: req.body.totalPrice,
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

//view payment by premise
app.get("/payments/:premiseNumber",function(req,res){
    Payment.findOne(
        {premiseNo:req.params.premiseNumber},
        function(err,foundPayments){
            if (foundPayments) {
                res.send(foundPayments)
            } else {
                res.send("No payment with provided premise Number");
            }
        }
    )
})

// SERVER LISTENING PORT
app.listen(3000,function(){
    console.log("Server started on port 3000");
});