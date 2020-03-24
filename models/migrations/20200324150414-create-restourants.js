'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('restaurants', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING,
        unique:true
      },
      login_id: {
        type: Sequelize.STRING,
        unique:true
      },
      phone: {
        type: Sequelize.STRING,
        unique:true
      },
      password: {
        type: Sequelize.STRING
      },
      token: {
        type: Sequelize.STRING,
        allowNull:true,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue:'deactive'
      },
      voen: {
        type: Sequelize.STRING,
        unique:true
      },
      balance: {
        type: Sequelize.FLOAT,
        defaultValue:0.00
      },
      card: {
        type: Sequelize.STRING,
        allowNull:true
      },
      feedback: {
        type: Sequelize.STRING,
        allowNull:true
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
  down: (queryInterface) => {
    return queryInterface.dropTable('restaurants');
  }
};
