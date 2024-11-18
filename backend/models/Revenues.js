const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    const Revenu = sequelize.define('Revenu', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'Transaction', 
                key: 'id',
            },
        },
        id_projet: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Projet', 
                key: 'id',
            },
        },
    }, {
        timestamps: false,
    });


    Revenu.beforeValidate(async (revenu) => {
        const transaction = await sequelize.models.Transaction.findByPk(revenu.id); 
        if (transaction && transaction.amount <= 0) {
            throw new Error('Amount for revenu must be positive.');
        }
    });

    Revenu.associate = (models) => {
        Revenu.belongsTo(models.Transaction, { foreignKey: 'id' });
        Revenu.belongsTo(models.Projet, { foreignKey: 'id_projet' }); 
    };

    return Revenu;
};
