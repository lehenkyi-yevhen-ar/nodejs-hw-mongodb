import { initMongoDB } from './db/initMongoConnection.js';
import { setupServer } from './server.js';


async function bootstrap() {
  try {
    await initMongoDB();
    setupServer();
  } catch (err) {
    console.log(err);
  }
}

bootstrap();
