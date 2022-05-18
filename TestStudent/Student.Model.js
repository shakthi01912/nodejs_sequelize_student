const sql = require("../_helpers/db.js");
const tableName = "students";

// constructor
const Student = function(student) {
  this.firstName = student.firstName;
  this.lastName = student.lastName;
  this.email = student.email;
  this.phone = student.phone;
  this.image = student.image,
  this.address = student.address;
  this.age = student.age;
  this.specialities = student.specialities;
};

const ModelName = Student;

ModelName.create = (newStudent, result) => {
  sql.query(`INSERT INTO ${tableName} SET ?`, newStudent, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created student: ", { id: res.insertId, ...newStudent });
    result(null, { id: res.insertId, ...newStudent });
  });
};

ModelName.findById = (studentId, result) => {
  sql.query(`SELECT * FROM ${tableName} WHERE id = ${studentId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found student: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found employee with the id
    result({ kind: "not_found" }, null);
  });
};

ModelName.getAll = result => {
  sql.query(`SELECT * FROM ${tableName}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("students: ", res);
    result(null, res);
  });
};

ModelName.updateById = (id, student, result) => {
  sql.query(
    `UPDATE ${tableName} SET firstName = ?, lastName = ?,email = ?,phone = ?,address = ?,age = ?,image = ?,specialities = ? WHERE id = ${id}`,
    [student.firstName, student.lastName,student.email,student.phone,student.address,student.age,student.specialities, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found employee with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated student: ", { id: id, ...employee });
      result(null, { id: id, ...employee });
    }
  );
};

ModelName.remove = (id, result) => {
  sql.query(`DELETE FROM ${tableName} WHERE id = ?`, id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found employee with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted student with id: ", id);
    result(null, res);
  });
};



module.exports = ModelName;