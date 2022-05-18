const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        firstName: 
            {   type: DataTypes.STRING,
                allowNull: false },

        lastName: 
            {   type: DataTypes.STRING,
                allowNull: false },

        email: 
            {   type: DataTypes.STRING,
                 allowNull: false },

        phone: 
            {   type: DataTypes.INTEGER,
                allowNull: false },

        address: 
            {   type: DataTypes.STRING,
                allowNull: false },

        age: 
            {   type: DataTypes.INTEGER,
                allowNull: false },

        specialities: 
            {   type: DataTypes.STRING,
                allowNull: false },

        image: 
            {   type: DataTypes.STRING, 
                allowNull: true },

        id: 
            {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true

            }
    };

    return sequelize.define('students', attributes,{
        timestamps: false
      });
}