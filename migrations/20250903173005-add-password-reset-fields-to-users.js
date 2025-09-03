'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'resetPasswordOTP', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('users', 'resetPasswordExpires', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'resetPasswordOTP');
    await queryInterface.removeColumn('users', 'resetPasswordExpires');
  }
};
