// models/Salaires.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Salaires = sequelize.define('Salaires', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        id_projet: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Projets', // Make sure this matches the correct table name
                key: 'id',
            },
        },
        id_freelancer: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Freelancers', // Ensure this is correct too
                key: 'id',
            },
        },
        salaire: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    }, {
        timestamps: false,
    });

    // Define associations
    Salaires.associate = (models) => {
        Salaires.belongsTo(models.Projets, { foreignKey: 'id_projet' });
        Salaires.belongsTo(models.Freelancers, { foreignKey: 'id_freelancer' });
    };

    return Salaires;
};
