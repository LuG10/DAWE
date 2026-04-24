const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const mongojs = require('mongojs');

const app = express();
const PORT = 8000;
const MONGO_URI = 'mongodb://localhost:27017/flora';

// 1. Configuración de la Base de Datos
const db = mongojs(MONGO_URI, ['usuarios', 'productos']);

// 2. IMPORTACIÓN DE RUTAS (Debe ir después de definir 'db' si las usas ahí)
const usuariosRouter = require('./rutas/usuarios');
const productosRouter = require('./rutas/productos');

// 3. Middlewares básicos
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // Para leer datos de formularios

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// 4. Configuración de Sesiones
app.use(session({
    secret: 'tu_secreto_aqui',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongoUrl: MONGO_URI,
        collection: 'sesiones'
    }),
    cookie: { 
        secure: false, 
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 
    }
}));

// 5. Definición de Rutas (Ahora que ya están importadas arriba)
app.use('/api/usuarios', usuariosRouter);
app.use('/api/productos', productosRouter);

// 6. Ruta de visitas por sesión (Punto 5.4 del PDF)
app.get('/api/visits', (req, res) => {
    if (!req.session.visits) {
        req.session.visits = 1;
    } else {
        req.session.visits += 1;
    }
    res.json({ visits: req.session.visits });
});

app.get('/', (req, res) => {
    res.send('Backend funcionando en DB flora');
});

// 7. Inicio del servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});