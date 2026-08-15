import express from 'express'
import cors from 'cors'
import helmet  from 'helmet'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import path from 'node:path'

import {config} from './config/env.js'
import routes from './routes/index.js'
import {notFound} from './middleware/notFound.js'
import {errorHandler} from './middleware/errorHandler.js'
import {globalRateLimit} from './middleware/rateLimit.js'

const app = express();

app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({
    origin:config.corsOrigins,
    credentials:true,
}));


app.use(express.json({limit:"10mb"}));
app.use(express.urlencoded({extended:true, limit:'10mb'}));
app.use(cookieParser());

app.use(morgan(config.isProduction ? 'combined': 'dev'));


app.use(
  config.uploads.imagesPublicPath,
  (req, res, next) => { res.set('Cross-Origin-Resource-Policy', 'cross-origin'); next(); },
  express.static(path.resolve(config.uploads.imagesDir))
);

app.use(globalRateLimit);

app.use('/api/v1', routes);

app.use(notFound);
app.use(errorHandler);

export default app;