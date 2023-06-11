'use strict';
const {Enums} = require('../utils');
const {BOOKED, CANCELLED, INITIATED, PENDING } = Enums.Status
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Booking.init({
    Flight_id: {
      type:DataTypes.INTEGER,
      allowNull:false,
    },
    user_id: {
      type:DataTypes.INTEGER,
      allowNull:false,
    },
    status: {
      type:DataTypes.ENUM,
      values : [BOOKED, CANCELLED, INITIATED, PENDING],
      defaultValue : INITIATED
    },
    number_of_seats: {
      type:DataTypes.INTEGER,
      allowNull:false,
    },
    total_cost: {
      type:DataTypes.INTEGER,
      allowNull:false,
    },
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};