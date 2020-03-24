import config from '../env';
import Sequelize from "sequelize";

const con =new Sequelize(config.database, config.sqlUser,config.sqlPass, {
    host: config.host,
    dialect: 'mysql'
});
con
    .authenticate()
    .then(() => {
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

export {
    con
}
