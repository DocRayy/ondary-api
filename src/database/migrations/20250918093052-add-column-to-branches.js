"use strict";

const sequelize = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("branches", {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.BIGINT,
      },
      address: {
        type: sequelize.TEXT,
        allowNull: false,
      },
      note: {
        type: sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      deleted_at: {
        type: sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("branches");
  },
};
