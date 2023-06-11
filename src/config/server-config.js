const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    FLIGHT_SERVER_CONFIG : process.env.FLIGHT_SERVER_CONFIG
}