'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      // A course has many chapters
      this.hasMany(models.Chapters, {
        foreignKey: 'course_id',
        as: 'chapters',
        onDelete: 'CASCADE',
      });

      // A course belongs to an educator (User)
      this.belongsTo(models.User, {
        foreignKey: 'educator_id',
        as: 'educator',
      });

      // A course can have many enrollments
      this.hasMany(models.Enrollments, {
        foreignKey: 'course_id',
        as: 'enrollments',
        onDelete: 'CASCADE',
      });
    }
  }

  Course.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    educator_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Course',
  });

  return Course;
};
