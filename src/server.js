import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';
import { basename } from './config.json';
import ViewsRoutes from './routes/views.routes';
import Oauth2Routes from './routes/Oauth2.routes';
import ProductsRoutes from './routes/products.routes';

const app = express();


app.set('PORT', process.env.PORT || 8000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'static')));
app.use(cookieParser());
app.use(cors());

app.use(`${basename}`, ViewsRoutes);
app.use(`${basename}/api/auth`, Oauth2Routes);
app.use(`${basename}/api/products`, ProductsRoutes);

const PORT = app.get('PORT');

app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
})