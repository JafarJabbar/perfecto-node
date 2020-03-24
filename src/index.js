import express from 'express'
import bodyParser from 'body-parser';
import AppRoutes from './routes';
import cors from 'cors';
const app=express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.listen(3300);

AppRoutes(app);

