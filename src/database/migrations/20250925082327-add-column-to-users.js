"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "url", {
      type: Sequelize.STRING,
      allowNull: true,
      after: "role",
    });

    await queryInterface.addColumn("users", "file_path", {
      type: Sequelize.STRING,
      allowNull: true,
      after: "url",
    });

    await queryInterface.addColumn("users", "is_active", {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      after: "file_path",
      defaultValue: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "url");
    await queryInterface.removeColumn("users", "file_path");
    await queryInterface.removeColumn("users", "is_active");
  },
};
