'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reports extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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