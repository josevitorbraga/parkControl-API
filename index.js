import express, { json } from 'express';
import router from './routes/router.js';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(json());
app.use(cors());
app.use(router);
app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const main = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/park');
    console.log('Connected to database');
    app.listen('3333', () => {
      console.log('Backend launched on port 3333 🚀');
    });
  } catch (e) {
    console.log('Failed to start the server ☠', e.message);
  }
};

main();
