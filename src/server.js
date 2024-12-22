import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { env } from './utils/env.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import cookieParser from 'cookie-parser';
import { auth } from './middlewares/authenticate.js';
import path from 'node:path';
import swaggerUI from 'swagger-ui-express';
import * as fs from 'node:fs';

const PORT = Number(env('PORT', '3000'));

const swaggerDoc = JSON.parse(
  fs.readFileSync(path.resolve('docs/swagger.json'), 'utf-8')
);

export const setupServer = () => {
  const app = express();

  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

  app.use('/photos', express.static(path.resolve('src/public/photos')));
  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  pino({
    transport: {
      target: 'pino-pretty'
    }
  });

  app.use('/contacts', auth, contactsRouter);
  app.use('/auth', authRouter);

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`CORS-enabled server is running on port ${PORT}`);
  });
};
