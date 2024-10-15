// models/utilisateurs.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Utilisateur = sequelize.define('Utilisateurs', { // Table name as plural
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nom: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        prenom: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('financier', 'chef de projet'),
            allowNull: false,
        },
    }, {
        timestamps: false,
    });

    return Utilisateur; // Should return Utilisateur, not Utilisateurs
};
