'use strict';
const {Enums} = require('../utils');
const {BOOKED, CANCELLED, INITIATED, PENDING } = Enums.Status
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Flight_id: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      status: {
        type: Sequelize.ENUM,
        values : [BOOKED, CANCELLED, INITIATED, PENDING ],
        defaultValue : INITIATED
      },
      number_of_seats: {
        type: Sequelize.INTEGER,
        allowNull : false
      },
      total_cost: {
        type: Sequelize.INTEGER,
        allowNull : false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Bookings');
  }
};