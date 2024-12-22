'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Countdownday extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Countdownday.init({
    startday: DataTypes.DATE,
    endday: DataTypes.DATE,
    content: DataTypes.TEXT,
    type: DataTypes.STRING,
    istop: DataTypes.BOOLEAN,
    ishow: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Countdownday',
  });
  return Countdownday;
};