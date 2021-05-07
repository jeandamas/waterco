const db = require("../models");
const Waterco = db.Waterco;

// Create and Save a waterco bill
exports.create = (req, res) => {
    // Validate request
    if (!req.body.title) {
      res.status(400).send({ message: "Content can not be empty!" });
      return;
    }
  
    // Create a bill
    const tutorial = new Tutorial({
      title: req.body.title,
      description: req.body.description,
      paid: req.body.paid ? req.body.paid : false
    });
  
    // Save bill in the database
    tutorial
      .save(tutorial)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the bill."
        });
      });
  };

// Retrieve all bills from the database.
exports.findAll = (req, res) => {
    const name = req.query.title;
    var condition = name ? { title: { $regex: new RegExp(name), $options: "i" } } : {};
  
    Waterco.find(condition)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving bills."
        });
      });
  };

// Find a single bill with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Waterco.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found BILL with id " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving BILL with id=" + id });
      });
  };

// Update a bill by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    }
  
    const id = req.params.id;
  
    Waterco.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update Bill with id=${id}. Maybe bill was not found!`
          });
        } else res.send({ message: "bill was updated successfully." });
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating bill with id=" + id
        });
      });
  };

// Delete a bill with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
  
    Waterco.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete bill with id=${id}. Maybe bill was not found!`
          });
        } else {
          res.send({
            message: "bill was deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete bill with id=" + id
        });
      });
  };

// Delete all bills from the database.
exports.deleteAll = (req, res) => {
    Waterco.deleteMany({})
      .then(data => {
        res.send({
          message: `${data.deletedCount} bill were deleted successfully!`
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all bills."
        });
      });
  };

// Find all paid bills
exports.findAllPaid = (req, res) => {
    Waterco.find({paid: true })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving bills."
        });
      });
  };
