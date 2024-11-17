import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { env } from './utils/env.js';
import { Student } from './db/models/student.js';

const PORT = Number(env('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty'
      }
    })
  );

  app.get('/contacts', async (req, res) => {
    const students = await Student.find();

    res.send({
      status: 200,
      message: 'Successfully found contacts',
      data: students
    });
  });

  app.get('/contacts/:id', async (req, res) => {
    const { id } = req.params;
    const student = await Student.findById(id);

    if (student === null) {
      return res
        .status(404)
        .send({ status: 404, message: 'Contact not found' });
    }
    res.send({
      status: 200,
      message: `Successfully found contact with id ${id}`,
      data: student
    });
  });

  app.use((req, res, next) =>
    res.status(404).send({ status: 404, message: 'Not Found' })
  );

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send({ status: 500, message: 'Internal server error' });
  });

  app.listen(PORT, () => {
    console.log(`CORS-enabled server is running on port ${PORT}`);
  });
};
