'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Enrollments extends Model {
    static associate(models) {
      // An enrollment belongs to a user (student)
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'student',
      });

      // An enrollment belongs to a course
      this.belongsTo(models.Course, {
        foreignKey: 'course_id',
        as: 'course',
      });
    }
  }

  Enrollments.init({
    user_id: DataTypes.INTEGER,
    course_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Enrollments',
  });

  return Enrollments;
};
