module.exports = function(sequelize, DataTypes) {
  var Transaction = sequelize.define('Transaction', {
    TransactionId: { 
      type: DataTypes.INTEGER,
      primaryKey: true,
      notNull: true,
      autoIncrement: true
    },
    Amount: { 
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    StripeId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    CardId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Network: {
      type: DataTypes.STRING,
      allowNull: false 
    },
    CardType: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'Transaction',
    timestamps: false, 
    classMethods: {
      // associate: function(models) {
      //   Transaction.belongsTo(models.Merchant);
      // }
    }
  }); 
  return Transaction;
};