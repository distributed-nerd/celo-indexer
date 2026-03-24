import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/sequilize';

class TransferEvent extends Model {
  public id!: number;
  public from!: string;
  public to!: string;
  public value!: string;
  public tokenAddress!: string;
  public blockNumber!: number;
  public txHash!: string;
  public logIndex!: number;
  public timestamp!: Date;
}

TransferEvent.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    from: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    to: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tokenAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    blockNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    txHash: {
      type: DataTypes.STRING(66),
      allowNull: false,
    },
    logIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'TransferEvent',
    tableName: 'transfer_events',
    indexes: [
      {
        // Unique constraint to prevent duplicate events on reconnect/replay
        unique: true,
        fields: ['txHash', 'logIndex'],
        name: 'transfer_events_tx_hash_log_index_unique',
      },
      {
        fields: ['tokenAddress'],
        name: 'transfer_events_token_address_idx',
      },
      {
        fields: ['from'],
        name: 'transfer_events_from_idx',
      },
      {
        fields: ['to'],
        name: 'transfer_events_to_idx',
      },
    ],
  }
);

export default TransferEvent;
