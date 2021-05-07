module.exports = app => {
    const waterco = require("../controllers/waterco.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Bill
    router.post("/", twaterco.create);
  
    // Retrieve all Bills
    router.get("/", waterco.findAll);
  
    // Retrieve all paid bills
    router.get("/paid", waterco.findAllpaid);
  
    // Retrieve a single Bill with id
    router.get("/:id", waterco.findOne);
  
    // Update a Bill with id
    router.put("/:id", waterco.update);
  
    // Delete a Bill with id
    router.delete("/:id", waterco.delete);
  

    router.delete("/", waterco.deleteAll);
  
    app.use('/api/waterco', router);
};