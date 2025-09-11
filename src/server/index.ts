import { createServer } from 'http';
import apiApp from './api';

const PORT = process.env.PORT || 3001;

const server = createServer(apiApp);

server.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});