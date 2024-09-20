'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CompletedPages extends Model {
    static associate(models) {
      CompletedPages.belongsTo(models.User, { foreignKey: 'student_id' });
      CompletedPages.belongsTo(models.Page, { foreignKey: 'page_id' });
    }
  }
  CompletedPages.init({
    completed_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    student_id: { type: DataTypes.INTEGER, allowNull: false },
    page_id: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    sequelize,
    modelName: 'CompletedPages',
  });
  return CompletedPages;
};
