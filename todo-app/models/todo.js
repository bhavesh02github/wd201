/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Todo.belongsTo(models.User, {
        foreignKey: 'userId'
      })
      // define association here
    }
    static addTodo({ title, duedate, userId }) {
      if (!title) {
        throw new Error("Title is required.");
      }
      if (!duedate) {
        throw new Error("Due date is required.");
      }
      return this.create({ title: title, duedate: duedate, completed: false, userId });
    }
    setCompletionStatus(completed) {
      let r = completed;
      return this.update({ completed: r });
    }
    static getTodos() {
      return this.findAll();
    }

    static async getCompleted(userId) {
      return this.findAll({
        where: {
          completed: true,
          userId
        },
      });
    }

    static getoverdueTodos(userId) {
      let date = new Date().toISOString().split("T")[0];
      return this.findAll({
        where: {
          duedate: {
            [Op.lt]: date,
          },
          userId,
          completed: {
            [Op.eq]: false,
          },
        },
      });
    }
    static getdueTodayTodos(userId) {
      let date = new Date().toISOString().split("T")[0];
      return this.findAll({
        where: {
          duedate: {
            [Op.eq]: date,
          },
          userId,
          completed: false,
        },
      });
    }
    static async remove(id) {
      return this.destroy({
        where: {
          id,
          userId
        },
      });
    }
    static getdueLaterTodos(userId) {
      let date = new Date().toISOString().split("T")[0];
      return this.findAll({
        where: {
          duedate: {
            [Op.gt]: date,
          },
          userId,
          completed: false,
        },
      });
    }
  }
  Todo.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
          len: 5,
        },
      },
      duedate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          notNull: true,
        },
      },
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};
