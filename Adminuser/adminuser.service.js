const config = require('../_helpers/config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/dbUser');


module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    sendOTP,
    checkOTP,
    resetPassword,
    delete: _delete
};

async function authenticate({ email, password }) {
    const user = await db.Admin.scope('withHash').findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.hash)))
        throw 'Email or password is incorrect';

    // authentication successful
    const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '7d' });
    return { ...omitHash(user.get()), token };
}

async function getAll() {
    return await db.Admin.findAll();
}

async function getById(id) {
    return await getUser(id);
}

async function create(params) {
    // validate
    if (await db.Admin.findOne({ where: { email: params.email } })) {
        throw 'Email "' + params.email + '" is already taken';
    }

    // hash password
    if (params.password) {
        params.hash = await bcrypt.hash(params.password, 10);
    }

    // save user
    await db.Admin.create(params);
}

async function update(id, params) {
    const user = await getUser(id);

    // validate
    const emailChanged = params.email && user.email !== params.email;
    if (emailChanged && await db.Admin.findOne({ where: { email: params.email } })) {
        throw 'Email "' + params.email + '" is already taken';
    }

    // hash password if it was entered
    if (params.password) {
        params.hash = await bcrypt.hash(params.password, 10);
    }

    // copy params to user and save
    Object.assign(user, params);
    await user.save();

    return omitHash(user.get());
}

async function sendOTP(email, params) {
    const user = await db.Admin.findOne({ where: { email: params.email } });
    var randomNumber = Math.floor(10000 + Math.random() * 90000);

    if(user){
        //send OTP mail
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
            subject: 'OTP Confirmation - man-power app',
            //   text: 'That was easy!'
            html :`<h1>Dear Sir/ Madam,</h1><p> Your OTP code - ${randomNumber}</p>`
        };

        transporter.sendMail(mailOptions, function(error, info){


            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
                return "work";
            }


        });

        //update OTP code in admin table
        db.Admin.update(
            { resetotp: `${randomNumber}` },
            { where: { id: user.id } }
        )
        Object.assign(user, params);
        await user.save();

        return {match: true, message : "OTP Send successfully!"};
    }

    throw 'User is not available';
    // return {match: false, message : "User is not available"};
}

async function checkOTP(email, params) {
    // const user = await getUser(6);
    const user = await db.Admin.findOne({ where: { email: params.email } })
    if(user.resetotp == params.resetotp){
        return {match: true, message : "OTP is correct!"};
    }
    return {match: false, message : "OTP is wrong!"};
}

async function resetPassword(email, params) {
    // const user = await getUser(6);
    const userfromdb = await db.Admin.findOne({ where: { email: email } })

    // validate
    if (userfromdb) {
        const user = await getUser(userfromdb.id);

        // hash password if it was entered
        if (params.password) {
            params.hash = await bcrypt.hash(params.password, 10);
        }

        // copy params to user and save
        Object.assign(user, params);
        await user.save();
        return {match: true, message : "Password updated successfully!"};
        // return omitHash(user.get());
    }
    throw 'Email "' + email + '" is not availabe';
}

async function _delete(id) {
    const user = await getUser(id);
    await user.destroy();
}

// helper functions

async function getUser(id) {
    const user = await db.Admin.findByPk(id);
    if (!user) throw 'User not found';
    return user;
}

function omitHash(user) {
    const { hash, ...userWithoutHash } = user;
    return userWithoutHash;
}