const { error } = require('winston');
const {Logger} = require('../config');
const {AppError} = require('../utils');
const {StatusCodes} = require('http-status-codes');
const { response } = require('express');
const { Op } = require("sequelize");
const {Enums} = require('../utils');
const {BOOKED, CANCELLED, INITIATED, PENDING } = Enums.Status


class CrudRepository{
    constructor(model){
        this.model = model;
    }
    async create(data){
            //console.log("inside the crud repository");
            const response = await this.model.create(data);
            console.log(response);
            return response;
    }
    async delete(data){
            const response = await this.model.destroy({
                where:{
                    id: data
                }
            });
            if(!response){
                throw new AppError("the resource you want to delete is not found",StatusCodes.NOT_FOUND);
            }
            return response;
    }
    async get(data){
        const response = await this.model.findByPk(data);
         if(!response){
            throw new AppError("the airplane you want is not present",StatusCodes.NOT_FOUND);
        }
        return response;
    }
    async getAll(){
            const response = await this.model.findAll()
            console.log(response);
            return response;
    }
    async update(data,ID){
            const response = await this.model.update(data,{
                where : {
                    id : ID,
                }
            });
            if(response == "0"){
                throw new AppError("the airplane you want to update didnt found",StatusCodes.NOT_FOUND);
            }
            return response;

    }
    
    
}
module.exports = CrudRepository;