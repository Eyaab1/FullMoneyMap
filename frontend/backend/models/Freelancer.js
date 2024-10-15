// models/Freelancer.js
const { DataTypes } = require('sequelize');

// Define the specialties as an object
const Specialties = {
    FRONT_END_DEVELOPER: 'Front-End Developer',
    BACK_END_DEVELOPER: 'Back-End Developer',
    UI_UX_DESIGNER: 'UI/UX Designer',
    GRAPHIC_DESIGNER: 'Graphic Designer',
    MOBILE_DEVELOPER: 'Mobile Developer',
    DATA_ANALYST: 'Data Analyst',
    SOCIAL_MEDIA_MANAGER: 'Social Media Manager',
};

// Export a function that defines the Freelancer model
module.exports = (sequelize) => {
    const Freelancer = sequelize.define('Freelancer', {
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
        specialty: {
            type: DataTypes.ENUM(Object.values(Specialties)), // Using ENUM for specialties
            allowNull: false,
        },
    }, {
        timestamps: false,
    });

    return Freelancer;
};
