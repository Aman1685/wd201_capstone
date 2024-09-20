'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Completed_pages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Completed_pages.init({
    completed_id: DataTypes.INTEGER,
    student_id: DataTypes.INTEGER,
    page_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Completed_pages',
  });
  return Completed_pages;
};