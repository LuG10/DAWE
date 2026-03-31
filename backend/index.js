const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const { MongoClient } = require('mongodb');

// Importar rutas
const usuariosRouter = require('./rutas/usuarios');
const productosRouter = require('./rutas/productos');

// Configuración
const app = express();
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tienda';

const mongojs = require('mongojs');
const db = mongojs(MONGO_URI);

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5000', 'http://frontend:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Sesiones
app.use(session({
    secret: 'tu_secreto_aqui', // Cambia esto por algo seguro
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongoUrl: MONGO_URI,
        // Tiempo de vida de la sesión: 24 horas
        ttl: 60 * 60 * 24,
        // Guardar inmediatamente las sesiones
        autoRemove: 'native'
        }),
    cookie: { secure: false } // Cambia a true en producción con HTTPS
}));

// Rutas
app.use('/api/usuarios', usuariosRouter);
app.use('/api/productos', productosRouter);

// Ruta de visitas
app.get('/api/visits', (req, res) => {
    db.visits.findOne({}, (err, doc) => {
        if (err) return res.status(500).json({error: 'Error'});
        if (!doc) {
            db.visits.insert({count: 1}, (err, newDoc) => {
                if (err) return res.status(500).json({error: 'Error'});
                res.json({visits: 1});
            });
        } else {
            const newCount = doc.count + 1;
            db.visits.update({_id: doc._id}, {$set: {count: newCount}}, (err) => {
                if (err) return res.status(500).json({error: 'Error'});
                res.json({visits: newCount});
            });
        }
    });
});

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Backend funcionando');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});