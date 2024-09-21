'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reports extends Model {
    static associate(models) {
      // A report belongs to a course
      this.belongsTo(models.Course, {
        foreignKey: 'course_id',
        as: 'course',
      });
    }
  }

  Reports.init({
    course_id: DataTypes.INTEGER,
    enrollment_count: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Reports',
  });

  return Reports;
};
