import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from "mongoose";
import * as process from "process";
require('dotenv').config()

const app = express();

app.use(cors({
    credentials: true,
}))

app.use(compression())
app.use(cookieParser())
app.use(bodyParser.json())

const server = http.createServer(app)


server.listen(3000, () => {
    console.info('Server Running')
})

mongoose.Promise = Promise
let mongoosePromise = mongoose.connect(process.env.MONGO_URL);
mongoose.connection.on('error', (error: Error) => console.info(error))