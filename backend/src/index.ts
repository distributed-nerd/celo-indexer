import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './controllers/api';
import aiRouter from './routes/airoute';
import listenForTransferEvents from './controllers/indexer';

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', apiRoutes);
app.use('/indexer', aiRouter);

app.get('/', (_req, res) => {
  res.json({ message: 'ERC-20 Transfer Indexer API', status: 'running' });
});

// Start the indexer immediately on server boot — not on a route hit
listenForTransferEvents().catch((err) => {
  console.error('Indexer failed to start:', err);
  process.exit(1);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('SIGINT', async () => {
  console.log('Shutting down API server...');
  process.exit(0);
});
