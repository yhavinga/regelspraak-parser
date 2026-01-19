/**
 * Express server factory for the RegelSpraak REST API.
 */

import express, { Application } from 'express';
import { createRouter, ServerOptions } from './routes';

export interface CreateServerOptions extends Omit<ServerOptions, 'engine'> {
  port?: number;
  cors?: boolean;
}

/**
 * Create and configure the Express application
 */
export function createServer(options: ServerOptions & { cors?: boolean }): Application {
  const app = express();

  // Parse JSON request bodies
  app.use(express.json());

  // Enable CORS if requested
  if (options.cors) {
    app.use((_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      if (_req.method === 'OPTIONS') {
        res.sendStatus(204);
        return;
      }
      next();
    });
  }

  // Mount the API router
  app.use('/api', createRouter(options));

  return app;
}

/**
 * Start the server on the specified port
 */
export function startServer(
  options: ServerOptions & { port?: number; cors?: boolean }
): Promise<void> {
  const port = options.port || 3000;
  const app = createServer(options);

  return new Promise((resolve) => {
    app.listen(port, () => {
      console.log(`RegelSpraak server running at http://localhost:${port}`);
      console.log(`\nLoaded files: ${options.files.join(', ')}`);
      console.log(`\nAvailable endpoints:`);
      console.log(`  GET  /api/         Health check`);
      console.log(`  GET  /api/model    Model metadata`);
      console.log(`  POST /api/validate Validate input data`);
      console.log(`  POST /api/execute  Execute rules`);
      resolve();
    });
  });
}
