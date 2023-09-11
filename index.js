import express from 'express';
import {router} from "./router.js";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());
app.use('/', router);
app.use('/uploads', express.static('uploads'));

const start = () => {
  try {
    mongoose.connect('mongodb+srv://admin:zaqzaq99@cluster0.irlfm0a.mongodb.net/blog')
      .then(() => console.log('DB ok'));
    app.listen(4444, () => console.log('Server is started'));
  } catch (e) {
    console.log(e)
  }
}

start();
