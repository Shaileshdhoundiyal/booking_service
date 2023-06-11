const axios = require('axios');
const {StatusCodes} = require('http-status-codes');
const {BookingRepository} = require('../repositories');
const db = require('../models');
const {AppError} = require('../utils')
const {ServerConfig} = require('../config')
const {Enums} = require('../utils');
const {BOOKED, CANCELLED, INITIATED, PENDING } = Enums.Status

const bookingRepository = new BookingRepository();
async function createBooking(data){
    const transaction = await db.sequelize.transaction();
    try {
        const flight = await axios.get(`${ServerConfig.FLIGHT_SERVER_CONFIG}/api/v1/flight/${data.Flight_id}`);
        const flightData = flight.data.data;
        console.log(flightData);
        if(data.number_of_seats > flightData.totalSeats){
            throw new AppError("the number of seats you want are not availaible",StatusCodes.BAD_REQUEST)
        }
        const totalPrice = data.number_of_seats * flightData.price;
        const bookingPayload = {...data, total_cost: totalPrice};
        const booking =bookingRepository.createBooking(bookingPayload,transaction);
        await axios.patch(`${ServerConfig.FLIGHT_SERVER_CONFIG}/api/v1/flight`,{
            flightId : data.Flight_id,
            seats : data.number_of_seats,
            desc : true
        });
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}
async function makePayment(data){
    const transaction = await db.sequelize.transaction();
    try {
        const bookingDetails = await bookingRepository.get(data.bookingId,transaction);
        console.log(bookingDetails);
        if(bookingDetails.status == CANCELLED){
            throw new AppError("the booking is expired",StatusCodes.BAD_REQUEST);
        }
        const bookingTime = new Date(bookingDetails.createdAt);
        const currentTime = new Date();
        if(currentTime - bookingTime > 300000) {
            await cancelBooking({
                bookingId : data.bookingId
            });
            throw new AppError('The booking has expired', StatusCodes.BAD_REQUEST);
        }
        if(data.totalCost != bookingDetails.total_cost){
            throw new AppError("the amount you entered didt match with the amount of seats",StatusCodes.BAD_REQUEST)
        }
        if(data.user_id != bookingDetails.user_id){
            throw new AppError("the user_id didt match",StatusCodes.BAD_REQUEST);
        }
        if(data.bookingId != bookingDetails.id){
            throw new AppError("the booking you want to make payment is not exist",StatusCodes.BAD_REQUEST)
        }
        await bookingRepository.update({status : BOOKED },bookingDetails.id,transaction)
        transaction.commit();
    } catch (error) {
        transaction.rollback();
        throw error;
    }
}

async function cancelBooking(data){
    const transaction = await db.sequelize.transaction();
    try {
        const bookingDetails = await bookingRepository.get(data.bookingId,transaction);
        if(bookingDetails.status == CANCELLED){
            throw new AppError("the booking is already cancelled",StatusCodes.BAD_REQUEST);
            transaction.commit();
        }
        await bookingRepository.update({status : CANCELLED },bookingDetails.id,transaction)
        transaction.commit();
    } catch (error) {
        console.log(error);
        transaction.rollback();
        throw error;
    }

}

async function cancelOldBooking(){
    try {
        const time = new Date();
        time.setMinutes(time.getMinutes()-20);
        return response = await bookingRepository.cancelOldBooking({status : CANCELLED},time);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createBooking,
    makePayment,
    cancelBooking,
    cancelOldBooking
}