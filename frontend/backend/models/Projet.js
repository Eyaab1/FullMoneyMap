// models/Projet.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Projet = sequelize.define('Projet', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nom: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date_debut: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        date_fin: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        budget: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        etat: {
            type: DataTypes.ENUM('en cours', 'terminé'),
            allowNull: false,
        },
        id_chef: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Utilisateurs', // Ensure this matches the actual table name
                key: 'id',
            },
        },
    }, {
        timestamps: false,
        validate: {
            async isChef() {
                const chef = await sequelize.models.Utilisateurs.findByPk(this.id_chef);
                if (!chef || chef.role !== 'chef de projet') {
                    throw new Error('id_chef must refer to a Utilisateur with the role "chef de projet".');
                }
            },
        },
    });

    // Define associations
    Projet.associate = (models) => {
        models.Utilisateurs.hasMany(Projet, { foreignKey: 'id_chef' });
        Projet.belongsTo(models.Utilisateurs, { foreignKey: 'id_chef' });
    };

    return Projet;
};
