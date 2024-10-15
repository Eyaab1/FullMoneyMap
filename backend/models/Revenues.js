// models/Revenu.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Revenu = sequelize.define('Revenu', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'Transaction', // Reference as a string
                key: 'id',
            },
        },
        id_projet: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Projet', // Reference as a string
                key: 'id',
            },
        },
    }, {
        timestamps: false,
    });

    // Ensure that the amount is positive
    Revenu.beforeValidate(async (revenu) => {
        const transaction = await sequelize.models.Transaction.findByPk(revenu.id); // Access Transaction model from sequelize instance
        if (transaction && transaction.amount <= 0) {
            throw new Error('Amount for revenu must be positive.');
        }
    });

    // Define associations
    Revenu.associate = (models) => {
        Revenu.belongsTo(models.Transaction, { foreignKey: 'id' });
        Revenu.belongsTo(models.Projet, { foreignKey: 'id_projet' }); // Adding association to Projet
    };

    return Revenu;
};
