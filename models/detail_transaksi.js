'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class detail_transaksi extends Model {
    static associate(models) {
      // detail transaksi - product
      this.belongsTo(models.product,{
        foreignKey: "product_id",
        as: "product"
      })
    }
  };
  detail_transaksi.init({
    transaksi_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey : true
    },
    price: DataTypes.DOUBLE,
    qty: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'detail_transaksi',
    tableName: "detail_transaksi"
  });
  return detail_transaksi;
};