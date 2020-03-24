import {con} from "../../src/classes/mysqlConn";
import {DataTypes} from "sequelize";

'use strict';
module.exports = () => {
  const Restaurants = con.define('restaurants', {
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    login_id: DataTypes.STRING,
    password: DataTypes.STRING,
    token: DataTypes.STRING,
    balance: DataTypes.FLOAT,
    card: DataTypes.STRING,
    status: DataTypes.STRING,
    voen: DataTypes.STRING,
    feedback: DataTypes.STRING
  }, {});
  Restaurants.associate = function(models) {
    // associations can be defined here
  };
  return Restaurants;
};
