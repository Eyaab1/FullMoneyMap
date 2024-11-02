
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
                model: 'Projets', 
                key: 'id',
            },
        },
        id_freelancer: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Freelancers', 
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

    
    Salaires.associate = (models) => {
        Salaires.belongsTo(models.Projets, { foreignKey: 'id_projet' });
        Salaires.belongsTo(models.Freelancers, { foreignKey: 'id_freelancer' });
    };

    return Salaires;
};
