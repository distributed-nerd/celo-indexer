'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDescription = await queryInterface.describeTable('transfer_events');

    // Add txHash column if it doesn't exist
    if (!tableDescription.txHash) {
      await queryInterface.addColumn('transfer_events', 'txHash', {
        type: Sequelize.STRING(66),
        allowNull: true, // nullable initially so existing rows don't fail
      });
    }

    // Add logIndex column if it doesn't exist
    if (!tableDescription.logIndex) {
      await queryInterface.addColumn('transfer_events', 'logIndex', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }

    // Add unique index on (txHash, logIndex) to prevent duplicate events
    await queryInterface.addIndex('transfer_events', ['txHash', 'logIndex'], {
      unique: true,
      name: 'transfer_events_tx_hash_log_index_unique',
      where: {
        txHash: { [Sequelize.Op.ne]: null },
        logIndex: { [Sequelize.Op.ne]: null },
      },
    });

    // Add performance indexes
    await queryInterface.addIndex('transfer_events', ['tokenAddress'], {
      name: 'transfer_events_token_address_idx',
    });

    await queryInterface.addIndex('transfer_events', ['from'], {
      name: 'transfer_events_from_idx',
    });

    await queryInterface.addIndex('transfer_events', ['to'], {
      name: 'transfer_events_to_idx',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeIndex('transfer_events', 'transfer_events_tx_hash_log_index_unique');
    await queryInterface.removeIndex('transfer_events', 'transfer_events_token_address_idx');
    await queryInterface.removeIndex('transfer_events', 'transfer_events_from_idx');
    await queryInterface.removeIndex('transfer_events', 'transfer_events_to_idx');
    await queryInterface.removeColumn('transfer_events', 'txHash');
    await queryInterface.removeColumn('transfer_events', 'logIndex');
  },
};
