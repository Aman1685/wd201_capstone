'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      Course.belongsTo(models.User, { foreignKey: 'educator_id' });
      Course.hasMany(models.Chapter, { foreignKey: 'course_id' });
      Course.hasMany(models.Enrollment, { foreignKey: 'course_id' });
    }
  }
  Course.init({
    course_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    educator_id: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false }
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};
