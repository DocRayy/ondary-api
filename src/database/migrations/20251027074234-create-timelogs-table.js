'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("timelogs", {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      task_todos_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "task_todos",
          key: "id",
        },
      },
      users_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      start: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      start_note: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      end: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      end_note: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      time: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      minuted_logged: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
