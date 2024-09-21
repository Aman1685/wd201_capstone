'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chapters extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // A chapter belongs to a course
      this.belongsTo(models.Course, {
        foreignKey: 'course_id',
        onDelete: 'CASCADE', // If a course is deleted, its chapters will also be deleted
      });

      // A chapter has many pages
      this.hasMany(models.Pages, {
        foreignKey: 'chapter_id',
        as: 'pages',
        onDelete: 'CASCADE', // Deleting a chapter will delete its associated pages
      });
    }
  }
  
  Chapters.init({
    name: DataTypes.STRING,
    course_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Chapters',
  });
  
  return Chapters;
};
