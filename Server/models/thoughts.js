'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Thoughts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Thoughts.init({
    text: DataTypes.TEXT,
    name: DataTypes.STRING,
    level: DataTypes.INTEGER,
    state: DataTypes.STRING,
    startdate: DataTypes.DATE,
    enddate: DataTypes.DATE,
    type: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Thoughts',
  });
  return Thoughts;
};