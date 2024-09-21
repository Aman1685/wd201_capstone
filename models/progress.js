'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Progress extends Model {
    static associate(models) {
      // Progress belongs to a user (student)
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'student',
      });

      // Progress belongs to a page
      this.belongsTo(models.Pages, {
        foreignKey: 'page_id',
        as: 'page',
      });
    }
  }

  Progress.init({
    user_id: DataTypes.INTEGER,
    page_id: DataTypes.INTEGER,
    completed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Progress',
  });

  return Progress;
};
