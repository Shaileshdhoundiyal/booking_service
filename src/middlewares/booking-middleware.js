const {StatusCodes} = require('http-status-codes');
const {error_resonse} = require('../utils');

async function ValidateBooking(req,res,next){
    console.log(req.body);
    next();
}

module.exports = ValidateBooking