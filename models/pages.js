'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Page extends Model {
    static associate(models) {
      Page.belongsTo(models.Chapter, { foreignKey: 'chapter_id' });
    }
  }
  Page.init({
    page_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    chapter_id: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    order: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    sequelize,
    modelName: 'Page',
  });
  return Page;
};
