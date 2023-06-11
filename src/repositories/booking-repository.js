
const {Booking} = require('../models')
const CrudRepository = require('./crud-repository')
 

class BookingRepository extends CrudRepository {
    constructor(){
        super(Booking);
    }
    async createBooking(bookingPayload,transaction){
         console.log(bookingPayload);
         const response = await this.model.create(bookingPayload,{transaction: transaction});
         console.log(response);
         return response;
    }
    async get(data,transaction){
        const response = await this.model.findByPk(data,{transaction : transaction});
         if(!response){
            throw new AppError("the booking you want is not present",StatusCodes.NOT_FOUND);
        }
        return response;
    }
    async update(data,bookingId,transaction){
        const response = await this.model.update(data,{
            where : {
                id : bookingId,
            }
        },{transaction : transaction});
        if(response == "0"){
            throw new AppError("the airplane you want to update didnt found",StatusCodes.NOT_FOUND);
        }
        return response;
    }

    async cancelOldBooking(data,time){
        const response = await this.model.update(data,{
            where : {
                [Op.and]: [{
                        createdAt: {
                            [Op.lt]: time
                        }
                    }, 
                    { 
                        status: {
                            [Op.eq] : INITIATED
                        } 
                    }
                ], 
            }
        });
        if(response == "0"){
            throw new AppError("the airplane you want to update didnt found",StatusCodes.NOT_FOUND);
        }
        return response;
    }
}

module.exports = BookingRepository