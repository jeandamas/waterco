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
    name:String,
    role:String,
    email:String,
    password:String,
}
const User = mongoose.model("User",userSchema);

//users route
app.route("/users")
//Sign Up
.post(function(req,res){
    //new user object
    const newUser = new User({
        name:req.body.name,
        role:req.body.role,
        email: req.body.email,
        password: req.body.password,
        
    });
    //save new user to the mongodb database
    newUser.save(function(err){
        if(!err){
            res.send("Successfuly registered New User");
        }else{
            res.send(err);
        }  
    });
})
//View all Clients
.get(function(req,res){
    User.find(function(err,usersFound){
        if (!err) {
            res.send(usersFound);
        }else{
            res.send(err);
        }
    });
});

//USER ID ROUTE
app.route("/users/:userID")
// View a USER
.get(function(req,res){
    User.findOne({_id:req.params.userID},function(err,foundUser){
        if(foundUser){
            res.send(foundUser);
        }else{
            res.send("No user found with that ID.");
        }
    });
})
//delete a user
.delete(function(req,res){
    User.deleteOne(
        {_id:req.params.userID},
        function(err){
            if (!err) {
                res.send("Successfully deleted the user");
            } else {
                res.send(err)
            }
        }
    )
})
//update user
.put(function(req,res){
    User.updateOne(
        {_id:req.params.userID},
        {name:req.body.name,role:req.body.role,email:req.body.email, password:req.body.password},
        {overwrite:true},
        function(err){
            if (!err) {
                res.send("User updated successfully");
            } else {
                res.send("error occured");
            }
        }
    );
});

// CLIENTS ////////////////////////////////////////////////////////////////////
//clientSchema
const clientSchema= {
    name: String,
    email:String
}
const Client = mongoose.model("Client",clientSchema);

//clients route
app.route("/clients")
//Add a Client
.post(function(req,res){
    const newClient = new Client({
        name:req.body.name,
        email:req.body.email,
    });
    newClient.save(function(err){
        if (!err) {
            res.send("Successfuly registered New Client");
        } else {
            res.send(err);
        }
    });
})
//View all Clients
.get(function(req,res){
    Client.find(function(err,foundClients){
        if (!err) {
            res.send(foundClients);
        }else{
            res.send(err);
        }
    });
})


//client id route
app.route("/clients/:clientID")
//View a Client
.get(function(req,res){
    Client.findOne({_id:req.params.clientID},function(err,foundClient){
        if(foundClient){
            res.send(foundClient)
        }else{
            res.send("No client found with that ID")
        }
    })
})
//delete a client
.delete(function(req,res){
    Client.deleteOne(
        {_id:req.params.clientID},
        function(err){
            if (err) {
                res.send("Successfully deleted the client");
            } else {
                res.send(err);
            }
        }
    )
})
// update client
.put(function(req,res){
    User.updateOne({_id:req.params.clientID},
        {name:req.body.name, email:req.body.email},
        {overwrite:true},
        function(err){
            if (!err) {
                res.send("Client updated successfully");
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

//oremises route
app.route("/premises")
//add new premise
.post(function(req,res){
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
})

//View All Premises
.get(function(req,res){
    Premise.find(function(err,foundPremises){
        if (!err) {
            res.send(foundPremises);
        }else(err);
    });
});
 
//get a client premise
app.route("/premises/client/:clientEmail")
.get(function(req,res){
    Premise.findOne({clientEmail:req.params.clientEmail},function(err,foundPremise){
        if (foundPremise) {
            res.send(foundPremise)
        } else {
            res.send("No premise with the client email you entered");
        }
    });
})

//PREMISE ROUTE
app.route("/premises/:premiseNumber")
//VIEW PREMISE
.get(function(req,res){
    Premise.findOne({premiseNo:req.params.premiseNumber},function(err,foundPremise){
        if (foundPremise) {
            res.send(foundPremise)
        } else {
            res.send("No premise with the premise number you entered");
        }
    });
})
//UPDATE PREMISE
app.put("/premises/:premiseNocl",function(req,res){
    Premise.update(
        {premiseNo:req.params.premiseNumber},
        {address:req.body, premiseNo:req.body.premiseNo, clientEmail:req.body.clientEmail},
        {overwrite:true}
    ),function(err){
        if (!err) {
            res.send("Successfuly updated premise");
        } else {
            res.send(err);
        }
    }
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

//BILLS ROUTE
app.route("/bills")
//CREATE NEW BILL
.post(function(req,res){
    const newBill = new Bill({
        billNumber:req.body.billNumber,
        units:req.body.units,
        unitPrice:req.body.unitPrice,
        totalPrice: req.body.totalPrice,
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
//get a bill
.get(function(req,res){
    Bill.find(function(err,foundBills){
        if (!err) {
            res.send(foundBills);
        } else {
            res.send(err);
        }
    });
})

app.get("/bills/:theBillNumber",function(req,res){
    Bill.findOne(
        {billNumber:req.params.theBillNumber},function(err,foundBills){
            if (foundBills) {
                res.send(foundBills)
            } else {
                res.send("No bill match the number entered")
            }
        }
    )
});


//Payments///////////////////////////////////////////////////////////////////
//paymentSchema
const paymentSchema={
    premiseNo:String,
    totalPrice:Number,
    paidAmount:Number,
    balance:Number
}
const Payment=mongoose.model("Payment",paymentSchema);

//create new payment
app.route("/payments")
.post(function(req,res){
    const newPayment = new Payment({
        premiseNo: req.body.premiseNo,
        totalPrice: req.body.totalPrice,
        paidAmount: req.paidAmount,
        balance: req.body.balance
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
.get(function(req,res){
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
