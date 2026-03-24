import Web3 from 'web3';
import TransferEvent from '../models/TransferEvent';
import sequelize from '../config/sequilize';
import dotenv from 'dotenv';

dotenv.config();

// Track last indexed block for resumption after restart
let lastIndexedBlock: number | null = null;

const createWeb3Instance = () => {
  const provider = new Web3.providers.WebsocketProvider(process.env.INFURA_URL as string);

  provider.on('connect', () => {
    console.log('WebSocket provider connected');
  });

  provider.on('error', (error: any) => {
    console.error('WebSocket error:', error);
  });

  provider.on('end', () => {
    console.log('WebSocket connection ended. Reconnecting in 5s...');
    setTimeout(() => {
      web3 = createWeb3Instance();
      setupSubscription();
    }, 5000);
  });

  return new Web3(provider);
};

let web3 = createWeb3Instance();

const transferEventSignature = web3.utils.sha3('Transfer(address,address,uint256)');
if (!transferEventSignature) {
  throw new Error('Failed to compute Transfer event signature hash.');
}

const setupSubscription = async () => {
  try {
    console.log('Setting up Transfer event subscription...');

    const filterOptions: { topics: string[]; fromBlock?: number } = {
      topics: [transferEventSignature],
    };

    // Resume from last indexed block if available
    if (lastIndexedBlock !== null) {
      filterOptions.fromBlock = lastIndexedBlock + 1;
      console.log(`Resuming from block ${filterOptions.fromBlock}`);
    }

    const subscription = await web3.eth.subscribe('logs', filterOptions);

    subscription.on('data', async (result) => {
      try {
        if (!result.topics || result.topics.length < 3) {
          return;
        }

        const from = web3.eth.abi.decodeParameter('address', result.topics[1]) as string;
        const to = web3.eth.abi.decodeParameter('address', result.topics[2]) as string;

        const rawValue = web3.eth.abi.decodeParameter('uint256', result.data);
        const value =
          typeof rawValue === 'string'
            ? rawValue
            : rawValue !== null && typeof rawValue === 'object' && 'toString' in rawValue
            ? (rawValue as any).toString()
            : String(rawValue);

        const tokenAddress = result.address?.toLowerCase() ?? '';
        const blockNumber = Number(result.blockNumber ?? 0);
        const txHash = result.transactionHash ?? '';
        const logIndex = Number(result.logIndex ?? 0);

        // Upsert: skip silently if (txHash, logIndex) already exists
        await TransferEvent.findOrCreate({
          where: { txHash, logIndex },
          defaults: {
            from: from.toLowerCase(),
            to: to.toLowerCase(),
            value,
            tokenAddress,
            blockNumber,
            txHash,
            logIndex,
            timestamp: new Date(),
          },
        });

        // Track highest block seen for resumption
        if (lastIndexedBlock === null || blockNumber > lastIndexedBlock) {
          lastIndexedBlock = blockNumber;
        }

        console.log(`Transfer: ${from} -> ${to} | value: ${value} | token: ${tokenAddress} | block: ${blockNumber}`);
      } catch (err) {
        console.error('Error processing Transfer event:', err);
      }
    });

    subscription.on('error', (error) => {
      console.error('Subscription error:', error);
      setTimeout(() => {
        console.log('Reconnecting after subscription error...');
        web3 = createWeb3Instance();
        setupSubscription();
      }, 10000);
    });

    subscription.on('connected', (subscriptionId) => {
      console.log(`Subscription active. ID: ${subscriptionId}`);
    });

    return subscription;
  } catch (error) {
    console.error('Failed to set up subscription:', error);
    setTimeout(() => {
      console.log('Retrying subscription setup...');
      web3 = createWeb3Instance();
      setupSubscription();
    }, 10000);
    return null;
  }
};

const listenForTransferEvents = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');

    // Wait briefly for WebSocket to establish
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await setupSubscription();

    console.log('Transfer event listener is running');
  } catch (e) {
    console.error('Failed to initialise transfer event listener:', e);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  console.log('Gracefully shutting down indexer...');

  try {
    await sequelize.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error closing database connection:', error);
  }

  try {
    const provider = web3.currentProvider as any;
    if (provider && typeof provider.disconnect === 'function') {
      provider.disconnect();
    }
    console.log('WebSocket connection closed.');
  } catch (error) {
    console.error('Error closing WebSocket:', error);
  }

  process.exit(0);
});

export default listenForTransferEvents;
