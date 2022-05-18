const Student = require("./Student.Model");

const ModelName = Student;

// Create and Save a new employee
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a employee
  const student = new ModelName({
    

    firstName : req.body.firstName,
    lastName : req.body.lastName,
    email : req.body.email,
    phone : req.body.phone,
    address : req.body.address,
    image : req.file.filename,
    age : req.body.age,
    specialities : req.body.specialities,

  });

  // Save employee in the database
  ModelName.create(student, (err, data) => {
    
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the employee."
      });
    else res.send({ "message": true ,data});
  });
  
};

// Retrieve all employees from the database.
exports.findAll = (req, res) => {
  ModelName.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving employees."
      });
    else res.send(data);
  });
};

// Find a single employee with a employeeId
exports.findOne = (req, res) => {
  ModelName.findById(req.params.studentId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found student with id ${req.params.employeeId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving student with id " + req.params.employeeId
        });
      }
    } else res.send(data);
  });
};

// Update a employee identified by the employeeId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  ModelName.updateById(
    req.params.studentId,
    new ModelName({
      // image: req.file.filename,
      firstName : req.body.firstName,
      lastName : req.body.lastName,
      email : req.body.email,
      phone : req.body.phone,
      address : req.body.address,
      age : req.body.age,
     
      specialities : req.body.specialities,
    }),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found student with id ${req.params.employeeId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating student with id " + req.params.employeeId
          });
        }
      } else res.send({ "message": true ,data});
    }
  );
};

// Delete a employee with the specified employeeId in the request
exports.delete = (req, res) => {
  ModelName.remove(req.params.studentId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found student with id ${req.params.studentId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete student with id " + req.params.studentId
        });
      }
    } else res.send({ message: `student was deleted successfully!` });
  });
};


