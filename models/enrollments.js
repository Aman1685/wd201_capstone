'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Enrollment extends Model {
    static associate(models) {
      Enrollment.belongsTo(models.User, { foreignKey: 'student_id' });
      Enrollment.belongsTo(models.Course, { foreignKey: 'course_id' });
    }
  }
  Enrollment.init({
    enrollment_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    student_id: { type: DataTypes.INTEGER, allowNull: false },
    course_id: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    sequelize,
    modelName: 'Enrollment',
  });
  return Enrollment;
};
