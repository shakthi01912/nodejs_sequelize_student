module.exports = app => {
    const student = require("./Student.Controller");
    const authorize = require('_middleware/authorize');
    const multer = require("multer");
    const path = require("path");

    const subUrl = "students";

    //image upload function
        const storage = multer.diskStorage({
          destination: './upload/images',
          filename: (req, file, cb) => {
              return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
          }
        })
        
        const upload = multer({
          storage: storage,
          limits: {
              fileSize: 1000000
          }
        })

  
    app.post(`/${subUrl}`, upload.single('image'), student.create);
  
  
    app.get(`/${subUrl}`, student.findAll);

    app.get(`/${subUrl}/:studentId`, student.findOne);
  

    app.put(`/${subUrl}/:studentId`,  student.update);
  
 
    app.delete(`/${subUrl}/:studentId`, student.delete);
  
  };