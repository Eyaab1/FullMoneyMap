// models/Depense.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Depense = sequelize.define('Depense', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'Transaction', // Reference as a string
                key: 'id',
            },
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        timestamps: false,
    });

    // Ensure that the amount is negative
    Depense.beforeValidate(async (depense) => {
        const transaction = await sequelize.models.Transaction.findByPk(depense.id); // Access Transaction model from sequelize instance
        if (transaction && transaction.amount >= 0) {
            throw new Error('Amount for depense must be negative.');
        }
    });

    // Define associations
    Depense.associate = (models) => {
        Depense.belongsTo(models.Transaction, { foreignKey: 'id' });
    };

    return Depense;
};
