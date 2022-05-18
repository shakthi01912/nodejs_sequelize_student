const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const userService = require('./adminuser.service');

// routes
router.post('/login', authenticateSchema, authenticate);
router.post('/register', registerSchema, register);
router.get('/', authorize(), getAll);
router.get('/current', authorize(), getCurrent);
router.get('/:id', authorize(), getById);
// router.put('/:id', updateSchema, update);
router.put('/:email', resetPassword);
router.post('/sendOTP', sendOTP);
router.post('/checkOTP', checkOTP);
router.delete('/:id', authorize(), _delete);

module.exports = router;

function authenticateSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => res.json({ errorMessage: false, message: user}))
        .catch(next);
}

function registerSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        phone: Joi.string().required(),
        password: Joi.string().min(6).required(),
        resetotp: Joi.string()
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({ errorMessage: false, message: 'Successfully registered' }))
        .catch(next);
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(next);
}

function getCurrent(req, res, next) {
    res.json(req.user);
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => res.json(user))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().empty(''),
        email: Joi.string().empty('').email(),
        phone: Joi.string().empty('').email(),
        password: Joi.string().min(6).empty(''),
        resetotp: Joi.string().min(6).empty('')
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(user => res.json({message: 'User updated successfully' , user}))
        .catch(next);
}

function sendOTP(req, res, next) {
    userService.sendOTP(req.params.email, req.body)
        .then(function(user){
            res.json(user)
        })
        .catch(next);
}

function checkOTP(req, res, next) {
    userService.checkOTP(req.params.email, req.body)
        .then(function(user){
            res.json({user})
        })
        .catch(next);
}


function resetPassword(req, res, next) {
    userService.resetPassword(req.params.email, req.body)
        .then(user => res.json(user))
        .catch(next);
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({ message: 'User deleted successfully' }))
        .catch(next);
}