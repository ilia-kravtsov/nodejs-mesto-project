import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import mainRouter from './routes/index';
import { RequestWithUser } from './types/index';
import errorHandler from './errors/error-handler';

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  (req as RequestWithUser).user = {
    _id: '680f60cb68fe08b9c8d744f9',
  };

  next();
});
app.use(mainRouter);
app.use(errorHandler);

app.listen(+PORT);

mongoose.connect('mongodb://localhost:27017/mestodb');
