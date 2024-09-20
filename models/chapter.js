'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Chapter extends Model {
    static associate(models) {
      Chapter.belongsTo(models.Course, { foreignKey: 'course_id' });
      Chapter.hasMany(models.Page, { foreignKey: 'chapter_id' });
    }
  }
  Chapter.init({
    chapter_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    course_id: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    order: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    sequelize,
    modelName: 'Chapter',
  });
  return Chapter;
};
