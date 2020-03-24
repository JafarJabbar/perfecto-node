import {con} from "../../src/classes/mysqlConn";
import {DataTypes} from "sequelize";

'use strict';
module.exports = () => {
  const Configs = con.define('configs', {
    app_key: DataTypes.STRING,
    lang:DataTypes.STRING,
  }, {});

  Configs.associate = function(models) {
  };
  return Configs;
};
