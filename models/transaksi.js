'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaksi extends Model {
    static associate(models) {
      // ini adalah blok untuk menghubungkan antar model/table
      /** one to one -> hasOne(), belongsTo()
       *  one to many-> hasMany(), belongsToMany()
       * 
       * has -> itu dipakai ketika menghubugkan parent ke child
       * belong -> itu dipakai ketika menghubungkan child ke parent
       */

       //transaksi - customer
       this.belongsTo(models.customer, {
         foreignKey: "customer_id",
         as: "customer"
       })

      // transaksi - detail_transaksi (one to many)
      this.hasMany(models.detail_transaksi, {
        foreignKey : "transaksi_id",
        as: "detail_transaksi"
      })
    }
  };
  transaksi.init({
    transaksi_id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    customer_id: DataTypes.INTEGER,
    waktu: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'transaksi',
    tableName: "transaksi"
  });
  return transaksi;
};