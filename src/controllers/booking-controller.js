const {StatusCodes} = require('http-status-codes');
const {BookingService} = require('../services')
const {error_resonse,Sucess_response} = require('../utils');
const error_response = require('../utils/common/error-responce');

const idempotent_db = {};

async function createBooking(req, res) {
    try {
        const response = await BookingService.createBooking({
            Flight_id: req.body.flightId,
            user_id: req.body.userId,
            number_of_seats: req.body.noofSeats
        });
        Sucess_response.data = response;
        return res
                .status(StatusCodes.OK)
                .json(Sucess_response);
    } catch(error) {
        console.log(error);
        error_resonse.error = error;
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(error_resonse);
    }
}
async function makePayment(req, res) {
    try {
        const idempotencyKey = req.headers['x-idempotency-key'];
        if(!idempotencyKey){
            error_response.error = "the idempotency key is missing"
            return res.status(StatusCodes.NOT_FOUND).json(error_response);
        }
        if(idempotent_db[idempotencyKey]){
            error_response.error = "the payment is already done ";
            return res.status(StatusCodes.BAD_REQUEST).json(error_response);
        }
       
        const response = await BookingService.makePayment({
            totalCost : req.body.totalCost,
            user_id: req.body.userId,
            bookingId : req.body.bookingId
        });
        inMemDb[idempotencyKey] = idempotencyKey;
        Sucess_response.data = response;
        return res
                .status(StatusCodes.OK)
                .json(Sucess_response);
    } catch(error) {
        console.log(error);
        error_resonse.error = error;
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(error_resonse);
    }
}
async function cancelBooking(req, res) {
    try {
        const response = await BookingService.cancelBooking({
            bookingId : req.body.bookingId
        });
        Sucess_response.data = response;
        return res
                .status(StatusCodes.OK)
                .json(Sucess_response);
    } catch(error) {
        console.log(error);
        error_resonse.error = error;
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(error_resonse);
    }
}
module.exports = {
    createBooking,
    makePayment,
    cancelBooking
}