'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Course, { foreignKey: 'educator_id' });
      User.hasMany(models.Enrollment, { foreignKey: 'student_id' });
    }
  }
  User.init({
    user_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('student', 'educator'), allowNull: false }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
