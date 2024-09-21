'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // A user (educator) can create many courses
      this.hasMany(models.Course, {
        foreignKey: 'educator_id',
        as: 'courses',
      });

      // A user (student) can have many enrollments
      this.hasMany(models.Enrollments, {
        foreignKey: 'user_id',
        as: 'enrollments',
      });

      // A user can track progress on many pages
      this.hasMany(models.Progress, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
      });
    }
  }

  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING // Either 'educator' or 'student'
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};
