'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Carts', 'totalPrice', {
        type: Sequelize.FLOAT,
        defaultValue: 0,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Carts', 'totalPrice', {
        defaultValue: null
    })
  }
};
