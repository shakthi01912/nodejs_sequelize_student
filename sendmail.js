var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jananij383@gmail.com',
    pass: 'pretty@1998'
  }
});

var mailOptions = {
  from: 'jananij383@gmail.com',
  to: 'jathurshanm3@gmail.com',
  subject: 'Sending Email using Node.js',
//   text: 'That was easy!'
html :'<h1>Welcome</h1><p>That was easy!</p>'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});