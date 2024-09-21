'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pages extends Model {
    static associate(models) {
      // A page belongs to a chapter
      this.belongsTo(models.Chapters, {
        foreignKey: 'chapter_id',
        as: 'chapter',
      });

      // A page can have many progress entries
      this.hasMany(models.Progress, {
        foreignKey: 'page_id',
        onDelete: 'CASCADE',
      });
    }
  }

  Pages.init({
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    chapter_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Pages',
  });

  return Pages;
};
